import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    hardhat: {
      loggingEnabled: true
    },
  },
};

export default config;
