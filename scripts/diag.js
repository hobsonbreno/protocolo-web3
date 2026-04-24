import { network } from "hardhat";

async function main() {
  const env = await network.create();
  console.log("Env keys:", Object.keys(env));
  if (env.ethers) {
    console.log("Ethers found in env!");
  } else {
    console.log("Ethers NOT found in env.");
  }
}

main().catch(console.error);
