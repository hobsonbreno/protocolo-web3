import { useState, useEffect, useRef } from 'react';
import './index.css';

const SCRIPT = [
  {
    scene: "0. Perfil Profissional",
    file: "APRESENTAÇÃO",
    type: "FILE",
    path: "Notebook / Perfil",
    command: "Nenhum",
    step: "1. Olhe para a câmera e se apresente. O monitor Dell já mostra seu resumo.",
    talk: "Olá, pessoal! meu nome é  Hobson Nascimento,sou engenheiro de Software. Atuo no backend de uma multinacional brasileira e acabei de concluir minha residência no IFCE em Sistemas Embarcados. Agora, estou consolidando meus conhecimentos em Web3 e Smart Contracts com o Nexus Protocol.",
    code: `NOME: Hobson Nascimento\nCARGO: Engenheiro de Software / Backend\nFORMAÇÃO: Residência IFCE (Sistemas Embarcados)\nPROJETO: Nexus Protocol MVP (U1C5)\n\n"Construindo a nova camada da economia digital."`
  },
  {
    scene: "1. Modelagem e Arquitetura",
    file: "README.md",
    type: "FILE",
    path: "/README.md",
    command: "Nenhum",
    step: "1. Clique no botão azul 'MOSTRAR ARQUIVO'. 2. Aponte para o diagrama na tela Dell.",
    talk: "O Nexus Protocol resolve o problema de incentivo à liquidez. Através de um ecossistema de Token, NFT e Staking, garantimos que a governança seja descentralizada e as recompensas baseadas em dados reais de mercado.",
    code: `🏗️ ARQUITETURA DO SISTEMA\n\n[Usuário] ───> NexusToken (ERC-20)\n[Usuário] ───> NexusNFT (ERC-721)\n[Usuário] ───> NexusStaking (Rewards)\n[Usuário] ───> NexusDAO (Governança)\n\n🔄 INTEGRAÇÕES TÉCNICAS:\n- Staking <──> Chainlink Oracle (Price Feed)\n- DAO <──> NexusToken (Voting Power)\n- Staking <──> NexusToken (Mint Rewards)`
  },
  {
    scene: "2. Token ERC-20 (Lógica)",
    file: "NexusToken.sol",
    type: "FILE",
    path: "contracts/NexusToken.sol",
    command: "Nenhum",
    step: "1. Clique no botão azul para abrir o código na Dell. 2. Destaque a função 'mint'.",
    talk: "Aqui temos o NexusToken. Ele herda de ERC20 e Ownable da OpenZeppelin. Implementamos uma função de mint restrita, garantindo que a emissão de novos tokens seja controlada pela governança.",
    code: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/token/ERC20/ERC20.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract NexusToken is ERC20, Ownable {\n    constructor(address initialOwner) ERC20("Nexus Token", "NEX") Ownable(initialOwner) {\n        _mint(initialOwner, 1000000 * 10**decimals());\n    }\n\n    function mint(address to, uint256 amount) public onlyOwner {\n        _mint(to, amount);\n    }\n}`
  },
  {
    scene: "3. Nexus NFT (Membros)",
    file: "NexusNFT.sol",
    type: "FILE",
    path: "contracts/NexusNFT.sol",
    command: "Nenhum",
    step: "1. Clique no botão azul para abrir o código na Dell. 2. Explique o URIStorage.",
    talk: "O NexusNFT permite a identificação dos membros. Usamos o padrão ERC-721 com URIStorage para que cada NFT possa carregar metadados exclusivos sobre a participação do usuário no protocolo.",
    code: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\nimport "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";\n\ncontract NexusNFT is ERC721, ERC721URIStorage, Ownable {\n    uint256 private _nextTokenId;\n\n    function safeMint(address to, string memory uri) public onlyOwner {\n        uint256 tokenId = _nextTokenId++;\n        _safeMint(to, tokenId);\n        _setTokenURI(tokenId, uri);\n    }\n}`
  },
  {
    scene: "4. Staking + Oráculo",
    file: "NexusStaking.sol",
    type: "FILE",
    path: "contracts/NexusStaking.sol",
    command: "Nenhum",
    step: "1. Clique no botão azul para mostrar o Oráculo na Dell. 2. Explique a taxa dinâmica.",
    talk: "Este é o núcleo DeFi. O contrato de Staking consulta o Oráculo da Chainlink em tempo real. Se o ETH valoriza, a recompensa é ajustada dinamicamente, atraindo mais liquidez para o protocolo.",
    code: `function getLatestPrice() public view returns (int) {\n    ( , int price, , , ) = priceFeed.latestRoundData();\n    return price;\n}\n\nfunction getAdjustedRewardRate() public view returns (uint256) {\n    int ethPrice = getLatestPrice();\n    return (rewardRate * uint256(ethPrice)) / (2000 * 10**8);\n}`
  },
  {
    scene: "5. Testes Unitários",
    file: "NexusProtocol.ts",
    type: "FILE",
    path: "test/NexusProtocol.ts",
    command: "npx hardhat test",
    step: "1. Clique no botão azul para abrir os testes. 2. Clique no botão verde para copiar o comando.",
    talk: "A segurança começa nos testes. Criamos uma suíte completa no Hardhat que valida desde a implantação até cenários complexos de stake e votação, garantindo que não existam falhas na lógica.",
    code: `describe("Nexus Protocol", function () {\n  it("Should stake tokens and earn rewards", async function () {\n    await token.approve(staking.getAddress(), stakeAmount);\n    await staking.stake(stakeAmount);\n    await networkHelpers.time.increase(3600);\n    expect(await staking.earned(owner.address) > 0n).to.be.true;\n  });\n});`
  },
  {
    scene: "6. Auditoria de Segurança",
    file: "audit_report.md",
    type: "FILE",
    path: "/audit_report.md",
    command: "slither .",
    step: "1. Clique no botão azul para abrir o relatório. 2. Explique a proteção contra Reentrancy.",
    talk: "Para a auditoria, utilizamos o Slither. O relatório confirma que implementamos ReentrancyGuard em todas as funções de movimentação de fundos, eliminando riscos de drenagem de liquidez.",
    code: `# Relatório de Auditoria Técnica\n\n| Item | Status | Observação |\n| :--- | :--- | :--- |\n| Reentrancy | ✅ Passou | Uso de nonReentrant |\n| Access Control | ✅ Passou | Ownable implementado |\n| Oracles | ✅ Passou | Chainlink V3 Interface |`
  },
  {
    scene: "7. Demonstração Live",
    file: "DASHBOARD",
    type: "LIVE",
    path: "Frontend Dashboard",
    command: "Nenhum",
    step: "1. Clique no botão azul para mudar a tela Dell para o Dashboard. 2. Comece a interagir.",
    talk: "Para finalizar, vamos à prática. Vou interagir com o Dashboard real conectado à testnet Sepolia. Veremos a transação sendo assinada no MetaMask e os saldos sendo atualizados on-chain.",
    code: ""
  },
  {
    scene: "8. Conclusão",
    file: "ENTREGÁVEIS",
    type: "FILE",
    path: "Final",
    command: "Nenhum",
    step: "1. Agradeça e peça para avaliarem o repositório. 2. Pare a gravação e salve o vídeo.",
    talk: "Este foi o Nexus Protocol. Um MVP robusto, testado e auditado, cumprindo 100% dos requisitos da Unidade 1. Muito obrigado e até a próxima!",
    code: `OBRIGADO!\n\nLink GitHub: github.com/hobsonbreno/protocolo-web3\nRede: Sepolia Testnet\nAuditoria: Slither / Mythril`
  }
];

export default function Teleprompter() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [studioStatus, setStudioStatus] = useState("OFFLINE");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerInterval = useRef<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const channel = useRef(new BroadcastChannel('nexus_studio_channel'));

  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.error(err); }
    }
    startWebcam();
    
    // Ouvir resposta do monitor Dell
    channel.current.onmessage = (event) => {
      if (event.data.type === 'HEARTBEAT_ACK') {
        setStudioStatus("CONNECTED");
      }
    };

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval.current);
    timerInterval.current = null;
  };

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 } });
      const webcamStream = videoRef.current?.srcObject as MediaStream;
      
      if (!webcamStream) {
        alert("Ligue a webcam antes de iniciar a gravação!");
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.play();

      const webcamVideo = document.createElement('video');
      webcamVideo.srcObject = webcamStream;
      webcamVideo.play();

      // Configurar dimensões do canvas baseadas no stream da tela
      const track = screenStream.getVideoTracks()[0];
      const settings = track.getSettings();
      canvas.width = settings.width || 1920;
      canvas.height = settings.height || 1080;

      const drawFrame = () => {
        if (!isRecording && mediaRecorder.current?.state === 'inactive') return;
        
        if (ctx) {
          // 1. Desenha a tela inteira
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
          
          // 2. Desenha a webcam no canto (Overlay circular)
          const camSize = canvas.width * 0.15; // 15% da largura da tela
          const margin = 30;
          const x = canvas.width - camSize - margin;
          const y = canvas.height - camSize - margin;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x + camSize/2, y + camSize/2, camSize/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(webcamVideo, x, y, camSize, camSize);
          ctx.restore();
          
          // Borda da webcam
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(x + camSize/2, y + camSize/2, camSize/2, 0, Math.PI * 2);
          ctx.stroke();
        }
        requestAnimationFrame(drawFrame);
      };

      const combinedStream = canvas.captureStream(30);
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getAudioTracks().forEach(t => combinedStream.addTrack(t));

      mediaRecorder.current = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp8,opus' });
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus_presentation_${new Date().getTime()}.webm`;
        a.click();
        chunks.current = [];
        screenStream.getTracks().forEach(t => t.stop());
        audioStream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
      drawFrame();
    } catch (err) { console.error(err); alert("Erro ao iniciar gravação"); }
  };

  const stopRecordingAndSave = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      setTimer(0);
    }
  };

  const togglePause = () => {
    if (!isRecording || !mediaRecorder.current) return;
    if (isPaused) {
      mediaRecorder.current.resume();
      startTimer();
    } else {
      mediaRecorder.current.pause();
      stopTimer();
    }
    setIsPaused(!isPaused);
  };

  const changeScene = (idx: number) => {
    setCurrentScene(idx);
    channel.current.postMessage({
      type: 'CHANGE_VIEW',
      viewType: SCRIPT[idx].type,
      file: SCRIPT[idx].file,
      code: SCRIPT[idx].code
    });
  };

  const copyToClipboard = (text: string) => {
    if (text === "Nenhum") return;
    navigator.clipboard.writeText(text);
    alert(`Comando [${text}] copiado!`);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', padding: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* MONITOR DE RETORNO */}
      <div style={{ 
        position: 'fixed', bottom: '2rem', right: '2rem', width: '300px', height: '170px', 
        borderRadius: '16px', overflow: 'hidden', border: '3px solid #38bdf8', zIndex: 100, background: '#000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(56, 189, 248, 0.8)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 'bold' }}>RETORNO</div>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#38bdf8' }}>NEXUS PRODUCTION STUDIO</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', borderRadius: '20px', border: `1px solid ${studioStatus === 'CONNECTED' ? '#10b981' : '#f43f5e'}` }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: studioStatus === 'CONNECTED' ? '#10b981' : '#f43f5e' }}></div>
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>DELL: {studioStatus}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => channel.current.postMessage({ type: 'FORCE_CAM' })}
            className="btn" style={{ width: 'auto', background: '#38bdf8', padding: '0.8rem 1.5rem', fontSize: '0.7rem' }}
          >
            🎥 LIGAR CAM NA DELL
          </button>
          
          <div style={{ background: '#1e293b', padding: '0.5rem 1.5rem', borderRadius: '12px', border: '1px solid #334155', fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981', minWidth: '120px', textAlign: 'center' }}>
            {formatTime(timer)}
          </div>
          
          {!isRecording ? (
            <button onClick={startRecording} className="btn" style={{ width: 'auto', background: '#10b981', padding: '0.8rem 1.5rem' }}>⏺ INICIAR GRAVAÇÃO</button>
          ) : (
            <>
              <button onClick={togglePause} className="btn" style={{ width: 'auto', background: isPaused ? '#f59e0b' : '#334155', padding: '0.8rem 1.5rem' }}>
                {isPaused ? "▶ RETOMAR" : "⏸ PAUSAR"}
              </button>
              <button onClick={stopRecordingAndSave} className="btn" style={{ width: 'auto', background: '#ef4444', padding: '0.8rem 1.5rem', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
                ⏹ PARAR E SALVAR
              </button>
            </>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ maxHeight: '45vh', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {SCRIPT.map((s, idx) => (
              <div 
                key={idx} onClick={() => changeScene(idx)}
                style={{ 
                  padding: '0.8rem', background: currentScene === idx ? 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)' : '#1e293b', 
                  borderRadius: '8px', cursor: 'pointer', transition: '0.2s', border: currentScene === idx ? '1px solid #7dd3fc' : '1px solid #334155'
                }}
              >
                <h3 style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{s.scene}</h3>
                <p style={{ fontSize: '0.6rem', opacity: 0.6 }}>📂 {s.file}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid #38bdf8' }}>
            <p style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: 'bold' }}>🔗 ACESSO RÁPIDO:</p>
            <a href="https://github.com/hobsonbreno/protocolo-web3" target="_blank" style={{ color: 'white', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem', textDecoration: 'none' }}>• Abrir GitHub</a>
            <a href="https://sepolia.etherscan.io/" target="_blank" style={{ color: 'white', fontSize: '0.8rem', display: 'block', textDecoration: 'none' }}>• Ver no Etherscan</a>
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '30px', border: '1px solid #334155', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => changeScene(currentScene)}
              style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '15px', border: '2px solid #38bdf8', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
            >
              <h2 style={{ color: '#38bdf8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>📁 MOSTRAR ARQUIVO (DEL):</h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>{SCRIPT[currentScene].path}</p>
              <span style={{ fontSize: '0.6rem', color: '#38bdf8', marginTop: '0.5rem', display: 'block' }}>[ CLIQUE PARA FORÇAR ABERTURA ]</span>
            </button>
            
            <button 
              onClick={() => copyToClipboard(SCRIPT[currentScene].command)}
              style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '15px', border: '2px solid #10b981', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
            >
              <h2 style={{ color: '#10b981', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>💻 COPIAR COMANDO:</h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>{SCRIPT[currentScene].command}</p>
              <span style={{ fontSize: '0.6rem', color: '#10b981', marginTop: '0.5rem', display: 'block' }}>[ CLIQUE PARA COPIAR ]</span>
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🛠️ PASSO A PASSO TÉCNICO:</h2>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#e2e8f0', background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '12px', borderLeft: '8px solid #38bdf8' }}>
              {SCRIPT[currentScene].step}
            </p>
          </div>

          <div>
            <h2 style={{ color: '#10b981', fontSize: '1rem', letterSpacing: '2px', marginBottom: '0.8rem', textTransform: 'uppercase' }}>🎙️ O QUE FALAR:</h2>
            <p style={{ fontSize: '3.2rem', lineHeight: '1.1', color: '#f8fafc', fontWeight: '600', background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '20px', textShadow: '0 4px 8px rgba(0,0,0,0.5)', textAlign: 'center' }}>
              "{SCRIPT[currentScene].talk}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
