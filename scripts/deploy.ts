import { network } from "hardhat";

async function main() {
  // @ts-ignore - Hardhat 3 novo padrão de inicialização
  const { ethers, networkName } = await network.create();
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 1. NexusToken
  const token = await ethers.deployContract("NexusToken", [deployer.address]);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("NexusToken deployed to:", tokenAddress);

  // 2. NexusNFT
  const nft = await ethers.deployContract("NexusNFT", [deployer.address]);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("NexusNFT deployed to:", nftAddress);

  // 3. NexusStaking
  let priceFeedAddress;
  if (networkName === "localhost" || networkName === "hardhat") {
    console.log("Detectada rede local. Fazendo deploy do MockV3Aggregator...");
    const mockOracle = await ethers.deployContract("MockV3Aggregator", [2000n * 10n ** 8n]);
    await mockOracle.waitForDeployment();
    priceFeedAddress = await mockOracle.getAddress();
    console.log("MockV3Aggregator implantado em:", priceFeedAddress);
  } else {
    // Endereço do Price Feed ETH/USD na Sepolia
    priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  }

  const staking = await ethers.deployContract("NexusStaking", [
    tokenAddress,
    tokenAddress,
    priceFeedAddress,
    deployer.address
  ]);
  await staking.waitForDeployment();
  console.log("NexusStaking deployed to:", await staking.getAddress());

  // 4. NexusDAO
  const dao = await ethers.deployContract("NexusDAO", [tokenAddress, deployer.address]);
  await dao.waitForDeployment();
  console.log("NexusDAO deployed to:", await dao.getAddress());

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
