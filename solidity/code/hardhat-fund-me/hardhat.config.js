/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 19:17:57
 * @LastEditTime: 2022-11-01 20:59:27
 */
require("@nomicfoundation/hardhat-toolbox");
// 部署合约
require("hardhat-deploy");
// etherscan验证
require("@nomiclabs/hardhat-etherscan");
// gas 消耗报告
require("hardhat-gas-reporter");
// 用于查看solidity哪里没被测试到
require("solidity-coverage");
require("dotenv").config();

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const GOERLI_ACCOUNT = process.env.GOERLI_ACCOUNT;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // 单个编译器
  // solidity: "0.8.17",
  // 多个编译器
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  // 账户名称，部署的时候需要用到
  namedAccounts: {
    deployer: {
      default: 0,
      // 5: GOERLI_ACCOUNT,
    },
  },
  networks: {
    // 部署到goerli测试网需要用到
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
      // 需要等待几个区块后再去验证
      blockConfirmations: 6,
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
    token: "ETH",
  },
};
