# RELATÓRIO TÉCNICO: DESENVOLVIMENTO DE PROTOCOLO WEB3 MVP

**Aluno:** Hobson Nascimento
**Disciplina:** Desenvolvimento de Protocolo Web3
**Data:** 19/04/2026

## 1. Introdução e Modelagem
O Nexus Protocol foi concebido como uma solução integrada de DeFi e Governança. O objetivo é permitir que usuários obtenham rendimentos (Staking) e participem da direção do projeto (DAO) através de um token utilitário centralizado.

### 1.1 Diagrama de Arquitetura
(Consulte o diagrama Mermaid no README.md do projeto)

### 1.2 Justificativa de Padrões
- **ERC-20**: Base do ecossistema para liquidez.
- **ERC-721**: Recompensas exclusivas e colecionáveis.

## 2. Implementação Técnica
A implementação utilizou Solidity 0.8.28 e bibliotecas OpenZeppelin para garantir robustez. O contrato de Staking é o "coração" do protocolo, unindo a emissão de tokens ao oráculo de preço da Chainlink.

## 3. Segurança e Auditoria
A auditoria manual identificou e mitigou riscos de Reentrancy no contrato de Staking através do `ReentrancyGuard`. O controle de acesso via `Ownable` garante que apenas o administrador possa executar funções sensíveis na DAO.

## 4. Integração com Oráculo
O contrato de Staking consome o par ETH/USD da Chainlink na rede Sepolia (`0x694...`). Esse dado é usado para calcular o multiplicador de recompensas, incentivando o stake em momentos de alta do mercado.

## 5. Deploy e Verificação
Os contratos foram implantados na rede Sepolia. Os endereços estão públicos e funcionais, permitindo a interação via scripts `ethers.js`.

---
**Assinatura:** Hobson Nascimento
```
