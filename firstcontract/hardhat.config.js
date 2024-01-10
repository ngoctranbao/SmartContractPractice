require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY_METAMASK],
    },
  },
  solidity: "0.8.19",
  etherscan: {
    apiKey: process.env.ETHER_API_KEY
  },
};
