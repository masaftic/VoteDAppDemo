import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      chainId: 31337,
    },
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 11155111
    },
    hardhat: {
      loggingEnabled: true
    },
  },
};

export default config;
