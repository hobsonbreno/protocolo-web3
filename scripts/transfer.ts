import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  const [owner] = await ethers.getSigners();
  const tx = await owner.sendTransaction({
    to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    value: ethers.parseEther("100.0")
  });
  await tx.wait();
  console.log("100 ETH enviados para 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4!");
}

main().catch(console.error);
