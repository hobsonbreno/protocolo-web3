import { network } from "hardhat";

async function main() {
  const net = await network.create();
  console.log("Keys in networkHelpers:", Object.keys(net.networkHelpers));
}

main();
