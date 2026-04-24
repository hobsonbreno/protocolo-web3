import { useState, useEffect, useRef } from 'react';
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';
import { TOKEN_ABI, NFT_ABI, STAKING_ABI, DAO_ABI } from './constants';
import './index.css';

const ADDRESSES = {
  token: "0x45e4abdB209993Ffb2aA14fA5bAD60e63F08723c",
  nft: "0x84C6BDCb3f246ba8E89cDe12c6033223Cf4Aa735",
  staking: "0xF3FaC53EA13a720eb0fd31bc0A30e8938fC752C4",
  dao: "0xE84fA145556cB711503c55fd468beaB53be6fEf2"
};

const SEPOLIA_CHAIN_ID = "0xaa36a7";

function App() {
  const [account, setAccount] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<string>("0");
  const [nexBalance, setNexBalance] = useState<string>("0");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [earnedRewards, setEarnedRewards] = useState<string>("0");
  const [proposals, setProposals] = useState<any[]>([]);
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [mintAmount, setMintAmount] = useState<string>("100");
  const [stakeAmount, setStakeAmount] = useState<string>("10");
  const [remoteView, setRemoteView] = useState<{ type: string, file: string, code: string }>({ type: 'LIVE', file: '', code: '' });
  const [isCamOn, setIsCamOn] = useState(false);
  const [isConnectedToStudio, setIsConnectedToStudio] = useState(false);
  const [userNFTs, setUserNFTs] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efeito Mirroring Canvas para evitar bloqueios de captura
  useEffect(() => {
    let animationId: number;
    const renderFrame = () => {
      if (videoRef.current && canvasRef.current && isCamOn) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      animationId = requestAnimationFrame(renderFrame);
    };
    renderFrame();
    return () => cancelAnimationFrame(animationId);
  }, [isCamOn]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, frameRate: 30 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCamOn(true);
        };
      }
    } catch (err) { console.error(err); }
  };

  const togglePiP = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await videoRef.current.requestPictureInPicture();
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    startWebcam();
    const channel = new BroadcastChannel('nexus_studio_channel');
    const heartbeat = setInterval(() => {
      channel.postMessage({ type: 'HEARTBEAT_ACK' });
    }, 1000);
    channel.onmessage = (event) => {
      if (event.data.type === 'CHANGE_VIEW') {
        setRemoteView({ type: event.data.viewType, file: event.data.file, code: event.data.code });
        setIsConnectedToStudio(true);
      }
      if (event.data.type === 'FORCE_CAM') startWebcam();
    };
    return () => { channel.close(); clearInterval(heartbeat); };
  }, []);

  const checkNetwork = async () => {
    if (!(window as any).ethereum) return false;
    try {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      const isSepolia = chainId.toLowerCase() === SEPOLIA_CHAIN_ID.toLowerCase();
      setIsWrongNetwork(!isSepolia);
      return isSepolia;
    } catch { return false; }
  };

  const switchNetwork = async () => {
    try {
      await (window as any).ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SEPOLIA_CHAIN_ID }] });
      setIsWrongNetwork(false);
      if (account) loadData(account);
    } catch (err: any) { console.error(err); }
  };

  const connectWallet = async () => {
    if (!(window as any).ethereum) { alert("Instale o MetaMask!"); return; }
    try {
      await (window as any).ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = accounts[0];
      if (userAccount) {
        setAccount(userAccount);
        const isSepolia = await checkNetwork();
        if (isSepolia) await loadData(userAccount);
      }
    } catch (err: any) { console.error(err); }
  };

  const loadData = async (userAddress: string) => {
    if (!userAddress) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const tokenContract = new Contract(ADDRESSES.token, TOKEN_ABI, provider);
      const stakingContract = new Contract(ADDRESSES.staking, STAKING_ABI, provider);
      const daoContract = new Contract(ADDRESSES.dao, DAO_ABI, provider);
      const nftContract = new Contract(ADDRESSES.nft, NFT_ABI, provider);

      const [balance, staked, earned, price, propCount, nftCount] = await Promise.all([
        tokenContract.balanceOf(userAddress).catch(() => 0n),
        stakingContract.balanceOf(userAddress).catch(() => 0n),
        stakingContract.earned(userAddress).catch(() => 0n),
        stakingContract.getLatestPrice().catch(() => 0n),
        daoContract.getProposalCount().catch(() => 0n),
        nftContract.balanceOf(userAddress).catch(() => 0n)
      ]);

      setNexBalance(Number(formatEther(balance)).toFixed(2));
      setStakedBalance(Number(formatEther(staked)).toFixed(2));
      setEarnedRewards(Number(formatEther(earned)).toFixed(6));
      setEthPrice((Number(price) / 1e8).toLocaleString());
      setUserNFTs(Number(nftCount));

      const props = [];
      for (let i = 0; i < Number(propCount); i++) {
        try {
          const p = await daoContract.proposals(i);
          props.push({ id: i, description: p[0], votes: formatEther(p[1]), executed: p[2] });
        } catch (e) {}
      }
      setProposals(props.reverse());
    } catch (err) { console.error(err); }
  };

  const handleMintTokens = async () => {
    if (!account) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(ADDRESSES.token, TOKEN_ABI, signer);
      await (await contract.mint(account, parseEther(mintAmount))).wait();
      loadData(account);
      alert("Tokens mintados!");
    } catch { alert("Erro ao mintar."); }
  };

  const handleStake = async () => {
    if (!account) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const token = new Contract(ADDRESSES.token, TOKEN_ABI, signer);
      const staking = new Contract(ADDRESSES.staking, STAKING_ABI, signer);
      const amount = parseEther(stakeAmount);
      await (await token.approve(ADDRESSES.staking, amount)).wait();
      await (await staking.stake(amount)).wait();
      loadData(account);
      alert("Stake realizado!");
    } catch { alert("Erro no stake."); }
  };

  const handleClaim = async () => {
    if (!account) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const staking = new Contract(ADDRESSES.staking, STAKING_ABI, signer);
      await (await staking.getReward()).wait();
      loadData(account);
      alert("Recompensas resgatadas!");
    } catch { alert("Erro no claim."); }
  };

  const handleMintNFT = async () => {
    if (!account) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const nft = new Contract(ADDRESSES.nft, NFT_ABI, signer);
      await (await nft.safeMint(account, "ipfs://nexus-member")).wait();
      loadData(account);
      alert("NFT Mintado!");
    } catch { alert("Erro no NFT."); }
  };

  const handleVote = async (id: number) => {
    if (!account) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const dao = new Contract(ADDRESSES.dao, DAO_ABI, signer);
      await (await dao.vote(id)).wait();
      loadData(account);
      alert("Voto registrado!");
    } catch { alert("Erro ao votar."); }
  };

  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkNetwork().then(ok => { if(ok) loadData(accounts[0]); });
        } else { setAccount(""); }
      });
      (window as any).ethereum.on('chainChanged', () => window.location.reload());
      checkNetwork();
    }
  }, []);

  return (
    <>
      {/* HEADER DE STATUS */}
      <div style={{ position: 'fixed', top: '1rem', left: '1rem', right: '1rem', zIndex: 100000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.85)', padding: '0.6rem 1.2rem', borderRadius: '30px', border: `1px solid ${isConnectedToStudio ? '#10b981' : '#f43f5e'}` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isConnectedToStudio ? '#10b981' : '#f43f5e' }}></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>{isConnectedToStudio ? "STUDIO LIVE" : "STUDIO OFFLINE"}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.85)', padding: '0.4rem', borderRadius: '15px' }}>
            {!isCamOn && <button onClick={startWebcam} style={{ background: '#38bdf8', border: 'none', borderRadius: '10px', color: 'white', fontSize: '0.7rem', padding: '0.5rem 1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>LIGAR CÂMERA 🎥</button>}
            <button onClick={togglePiP} style={{ background: '#10b981', border: 'none', borderRadius: '10px', color: 'white', fontSize: '0.7rem', padding: '0.5rem 1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>PIP 🪟</button>
          </div>
        </div>
        {remoteView.type === 'FILE' && <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.6rem 1.5rem', borderRadius: '30px', border: '1px solid #38bdf8', color: '#38bdf8', fontWeight: 'bold', fontSize: '0.9rem' }}>📂 {remoteView.file}</div>}
      </div>

      {/* WEBCAM DINÂMICA PARA APRESENTAÇÃO */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: remoteView.type === 'FILE' ? 'auto' : '2rem',
          top: remoteView.type === 'FILE' ? '2rem' : 'auto',
          right: '2rem', 
          width: remoteView.type === 'FILE' ? '280px' : '220px', 
          height: remoteView.type === 'FILE' ? '280px' : '220px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          border: `4px solid ${isCamOn ? '#10b981' : '#334155'}`, 
          zIndex: 1000000, 
          background: '#000', 
          boxShadow: remoteView.type === 'FILE' 
            ? '0 0 50px rgba(16, 185, 129, 0.3), 0 10px 40px rgba(0,0,0,0.8)' 
            : '0 10px 40px rgba(0,0,0,0.8)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none'
        }}
      >
        <video ref={videoRef} autoPlay muted playsInline style={{ display: 'none' }} />
        <canvas ref={canvasRef} width="400" height="400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!isCamOn && <div style={{ color: '#475569', fontSize: '0.7rem', textAlign: 'center', padding: '1rem' }}>CÂMERA OFFLINE<br/><span style={{fontSize:'0.5rem'}}>Use o Studio para ligar</span></div>}
      </div>

      <div className="container" style={{ paddingTop: '5rem' }}>
        {remoteView.type === 'FILE' ? (
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ background: '#0f172a', padding: '3.5rem', borderRadius: '40px', border: '2px solid #334155', fontFamily: 'Fira Code, monospace', fontSize: '2.6rem', lineHeight: '1.4', whiteSpace: 'pre-wrap', color: '#f1f5f9', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
              {remoteView.code}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn btn-secondary" style={{ width: 'auto', padding: '1rem 2.5rem' }} onClick={() => setRemoteView({ type: 'LIVE', file: '', code: '' })}>🔙 VOLTAR AO DASHBOARD</button>
            </div>
          </div>
        ) : (
          <>
            <header>
              <div className="logo">NEXUS PROTOCOL</div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '20px', border: `1px solid ${account && !isWrongNetwork ? '#4ade80' : '#f43f5e'}` }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: account && !isWrongNetwork ? '#4ade80' : '#f43f5e' }}></span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{account && !isWrongNetwork ? "CONNECTED" : (isWrongNetwork ? "REDE ERRADA" : "DISCONNECTED")}</span>
                </div>
                {isWrongNetwork ? (
                  <button className="btn btn-primary" style={{ width: 'auto', background: '#f43f5e' }} onClick={switchNetwork}>MUDAR REDE</button>
                ) : (
                  <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={connectWallet}>{account ? `${account.substring(0, 6)}...` : "CONECTAR"}</button>
                )}
              </div>
            </header>
            <div className="oracle-banner">🌐 CHAINLINK PRICE FEED: ETH/USD = ${ethPrice}</div>
            
            <div className="grid">
              {/* CARD TOKEN */}
              <div className="card">
                <h2>Nexus Token (ERC-20)</h2>
                <div className="stats-row"><span>Seu Saldo:</span> <span>{nexBalance} NEX</span></div>
                <div style={{marginTop:'1rem'}}>
                  <input type="number" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} style={{width:'100%', marginBottom:'0.5rem'}} />
                  <button className="btn btn-primary" onClick={handleMintTokens}>MINT TOKENS</button>
                </div>
              </div>

              {/* CARD STAKING */}
              <div className="card">
                <h2>Staking (DeFi)</h2>
                <div className="stats-row"><span>Em Stake:</span> <span>{stakedBalance} NEX</span></div>
                <div className="stats-row"><span>Recompensas:</span> <span style={{color: '#4ade80'}}>+{earnedRewards} NEX</span></div>
                <div style={{marginTop:'1rem'}}>
                  <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} style={{width:'100%', marginBottom:'0.5rem'}} />
                  <div style={{display:'flex', gap:'5px'}}><button className="btn btn-primary" onClick={handleStake}>STAKE</button><button className="btn btn-secondary" onClick={handleClaim}>CLAIM</button></div>
                </div>
              </div>

              {/* CARD NFT */}
              <div className="card">
                <h2>Nexus NFT (ERC-721)</h2>
                <div className="stats-row"><span>Seus NFTs:</span> <span>{userNFTs} Unidades</span></div>
                <p style={{fontSize:'0.7rem', color:'#94a3b8', margin:'1rem 0'}}>Membros ativos recebem status exclusivo no protocolo.</p>
                <button className="btn btn-primary" onClick={handleMintNFT}>MINT MEMBER NFT</button>
              </div>

              {/* CARD DAO */}
              <div className="card">
                <h2>Governança (DAO)</h2>
                <div style={{maxHeight: '120px', overflowY: 'auto', marginBottom: '1rem'}}>
                  {proposals.length > 0 ? proposals.map(p => (
                    <div key={p.id} style={{fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems:'center', border:'1px solid rgba(255,255,255,0.1)'}}>
                      <span style={{maxWidth:'150px'}}>{p.description}</span>
                      <button className="btn btn-primary" onClick={() => handleVote(p.id)} style={{fontSize: '0.6rem', width:'auto', padding:'4px 8px'}}>VOTAR</button>
                    </div>
                  )) : <p style={{fontSize:'0.7rem', color:'#94a3b8'}}>Nenhuma proposta ativa.</p>}
                </div>
                <div className="stats-row" style={{fontSize:'0.7rem', opacity:0.6}}><span>Propostas totais:</span> <span>{proposals.length}</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
