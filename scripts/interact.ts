import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // @ts-ignore - Hardhat 3
  const { ethers } = await network.create();
  const [user] = await ethers.getSigners();

  // Pegando endereços do .env
  const TOKEN_ADDR = process.env.NEXUS_TOKEN_ADDR;
  const NFT_ADDR = process.env.NEXUS_NFT_ADDR;
  const STAKING_ADDR = process.env.NEXUS_STAKING_ADDR;
  const DAO_ADDR = process.env.NEXUS_DAO_ADDR;

  if (!TOKEN_ADDR || !NFT_ADDR || !STAKING_ADDR || !DAO_ADDR) {
    throw new Error("Endereços dos contratos não encontrados no .env!");
  }

  console.log("--- Iniciando Demonstração Web3 Real ---");
  console.log("Usuário:", user.address);

  // 1. MINT DE NFT
  console.log("\n1. Executando Safe Mint de NFT...");
  const nft = await ethers.getContractAt("NexusNFT", NFT_ADDR);
  const mintTx = await nft.safeMint(user.address, "ipfs://projeto-final-web3");
  await mintTx.wait();
  console.log("NFT Mintado com sucesso! Transação confirmada.");

  // 2. STAKE DE TOKENS
  console.log("\n2. Executando Stake de 100 NEX Tokens...");
  const token = await ethers.getContractAt("NexusToken", TOKEN_ADDR);
  const staking = await ethers.getContractAt("NexusStaking", STAKING_ADDR);
  
  const amount = ethers.parseEther("100");
  console.log("Aprovando tokens para o contrato de Staking...");
  const approveTx = await token.approve(STAKING_ADDR, amount);
  await approveTx.wait();
  
  console.log("Realizando Stake...");
  const stakeTx = await staking.stake(amount);
  await stakeTx.wait();
  console.log("Stake realizado com sucesso!");

  // 3. VOTAÇÃO NA DAO
  console.log("\n3. Criando e Votando em Proposta na DAO...");
  const dao = await ethers.getContractAt("NexusDAO", DAO_ADDR);
  
  console.log("Criando nova proposta...");
  const propTx = await dao.createProposal("Aprovação do MVP Final - Unidade 1 Capítulo 5");
  await propTx.wait();
  
  // Pegamos o ID da última proposta
  const propCount = await dao.getProposalCount();
  const propId = Number(propCount) - 1;

  console.log(`Votando na proposta ID ${propId}...`);
  const voteTx = await dao.vote(propId);
  await voteTx.wait();
  console.log("Voto registrado e governança validada!");

  console.log("\n--- Demonstração Concluída com Credenciais Reais! ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
