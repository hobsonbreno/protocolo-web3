# Nexus Protocol - Web3 MVP

Este repositório contém o desenvolvimento completo de um protocolo Web3, integrando Tokenomics, NFTs, Staking, Governança e Oráculos.

## 🚀 Tecnologias Utilizadas
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin.
- **Oracle:** Chainlink Data Feeds.
- **Frontend:** React, Vite, ethers.js.
- **Segurança:** ReentrancyGuard, AccessControl.

## 📂 Estrutura do Projeto
- `/contracts`: Contratos inteligentes em Solidity.
- `/test`: Testes automatizados (Hardhat).
- `/scripts`: Scripts de deploy e utilitários.
- `/frontend`: Interface do usuário em React.

## 🛠️ Como Executar
1. Instale as dependências: `npm install`
2. Execute os testes: `npx hardhat test`
3. Configure as variáveis em `.env`.
4. Faça o deploy: `npx hardhat run scripts/deploy.ts --network sepolia`

## 📄 Relatórios
- [Relatório Técnico](./Technical_Report.md)
- [Relatório de Auditoria](./Audit_Report.md)

---
Desenvolvido por Hobson Breno para a disciplina de Web3 Avançado.
