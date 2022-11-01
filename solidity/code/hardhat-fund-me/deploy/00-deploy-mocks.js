/*
 * @Descripttion: mock
 * @Author: lizhengxing
 * @Date: 2022-10-31 20:30:43
 * @LastEditTime: 2022-10-31 21:55:49
 */
const { network } = require("hardhat");
const {
  developmentChainIds,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // 只在hardhat本地网络部署
  if (developmentChainIds.includes(chainId)) {
    log("开发环境，开始部署ETH/USD喂价MOCK合约");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    // log
    // deploying "MockV3Aggregator"
    // (tx: 0x48bdfdd64644a5dd70bcefa793bec388fd55ccc9e6c6b6e4988db8d5cafde888)...:
    // deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
    log("ETH/USD喂价MOCK合约部署完成");
  }
};
// 声明tag可以在部署的时候指定tag部署，比如 yarn hardhat deploy --tags mocks
module.exports.tags = ["all", "mocks"];
