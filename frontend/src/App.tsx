import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { TOKEN_ABI, NFT_ABI, STAKING_ABI, DAO_ABI } from './constants';
import './App.css';

// Endereços de exemplo (Devem ser atualizados após o deploy)
const ADDRESSES = {
  token: "0x5FbDB2315678afecb367f032d93F642f64180aa3", 
  nft: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  staking: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  dao: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
};

function App() {
  const [account, setAccount] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<string>("0");
  const [nexBalance, setNexBalance] = useState<string>("0");
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [earnedRewards, setEarnedRewards] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        loadData(accounts[0]);
      } catch (err) {
        console.error("Connection failed", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const loadData = async (userAddress: string) => {
    if (!userAddress || !ADDRESSES.token.startsWith("0x5")) return;
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const tokenContract = new Contract(ADDRESSES.token, TOKEN_ABI, provider);
      const stakingContract = new Contract(ADDRESSES.staking, STAKING_ABI, provider);

      const balance = await tokenContract.balanceOf(userAddress);
      const staked = await stakingContract.balanceOf(userAddress);
      const earned = await stakingContract.earned(userAddress);
      const price = await stakingContract.getLatestPrice();

      setNexBalance(formatEther(balance));
      setStakedBalance(formatEther(staked));
      setEarnedRewards(formatEther(earned));
      setEthPrice((Number(price) / 1e8).toLocaleString());
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    // Simulação de transação
    await new Promise(r => setTimeout(r, 1500));
    alert(`${action} executado com sucesso! (Modo Simulação)`);
    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>Nexus Protocol</h1>
        <button className="btn btn-secondary" style={{width: 'auto'}} onClick={connectWallet}>
          {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
        </button>
      </header>

      <div className="oracle-price">
        ETH/USD ORACLE: ${ethPrice}
      </div>

      <div className="grid">
        {/* Token Card */}
        <div className="card">
          <h2>Nexus Token (NEX)</h2>
          <div className="stats">
            <span>Seu Saldo:</span>
            <span>{nexBalance} NEX</span>
          </div>
          <input type="number" placeholder="Quantidade para Mint" />
          <button className="btn" onClick={() => handleAction("Mint")} disabled={loading}>
            {loading ? "Processando..." : "Mint NEX Tokens"}
          </button>
        </div>

        {/* Staking Card */}
        <div className="card">
          <h2>Staking Pool</h2>
          <div className="stats">
            <span>Em Stake:</span>
            <span>{stakedBalance} NEX</span>
          </div>
          <div className="stats">
            <span>Recompensas:</span>
            <span style={{color: '#4ade80'}}>+{earnedRewards} NEX</span>
          </div>
          <button className="btn" onClick={() => handleAction("Stake")} disabled={loading}>
            Stake NEX
          </button>
          <button className="btn btn-secondary" onClick={() => handleAction("Claim")} disabled={loading}>
            Claim Rewards
          </button>
        </div>

        {/* NFT Card */}
        <div className="card">
          <h2>Nexus NFT</h2>
          <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>Membros exclusivos ganham bônus no staking.</p>
          <button className="btn" onClick={() => handleAction("Mint NFT")} disabled={loading}>
            Mint Member NFT
          </button>
        </div>

        {/* DAO Card */}
        <div className="card">
          <h2>Governance (DAO)</h2>
          <div className="stats">
            <span>Propostas Ativas:</span>
            <span>2</span>
          </div>
          <div className="card" style={{background: 'rgba(0,0,0,0.2)', padding: '0.75rem', marginTop: '1rem'}}>
            <p style={{margin: 0, fontSize: '0.9rem'}}>#01: Aumentar taxa de recompensa</p>
            <button className="btn" style={{padding: '0.4rem', fontSize: '0.8rem'}} onClick={() => handleAction("Vote")}>
              Vote YES
            </button>
          </div>
        </div>
      </div>

      <footer style={{marginTop: '4rem', textAlign: 'center', color: '#64748b', fontSize: '0.8rem'}}>
        <p>Nexus Protocol MVP - Desenvolvido para a Tarefa Web3 Avançada</p>
      </footer>
    </div>
  );
}

export default App;
