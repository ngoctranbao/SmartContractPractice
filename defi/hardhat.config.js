require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MAINNET_RPC_URL,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY_METAMASK],
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ],
  },
  etherscan: {
    apiKey: process.env.ETHER_API_KEY
  },
};

