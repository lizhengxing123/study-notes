/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 20:08:21
 * @LastEditTime: 2022-10-29 22:21:10
 */
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
// 用于查看solidity哪里没被测试到
require("solidity-coverage");
require("dotenv").config();
require("./tasks/block-number");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
console.log("COINMARKETCAP_API_KEY: ", COINMARKETCAP_API_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat", // chainId
  networks: {
    // 部署到goerli测试网需要用到
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      // accounts: [], hardhat 会自动填充
      chainId: 31337,
    },
  },
  // 用于etherscan合约验证
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  // 测试gas消耗
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
