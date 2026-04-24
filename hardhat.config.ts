import { HardhatUserConfig, defineConfig } from "hardhat/config";
import ethersPlugin from "@nomicfoundation/hardhat-ethers";
import verifyPlugin from "@nomicfoundation/hardhat-verify";
import networkHelpersPlugin from "@nomicfoundation/hardhat-network-helpers";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    ethersPlugin,
    verifyPlugin,
    networkHelpersPlugin,
    hardhatToolboxMochaEthersPlugin
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // @ts-ignore
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
});
