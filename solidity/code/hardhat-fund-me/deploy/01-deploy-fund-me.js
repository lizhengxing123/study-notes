/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 19:43:45
 * @LastEditTime: 2022-11-01 16:21:18
 */
const { network } = require("hardhat");
const {
  networkConfig,
  developmentChainIds,
} = require("../helper-hardhat-config");
const verify = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  // 部署方法
  const { deploy, log, get } = deployments;
  // 账户
  const { deployer } = await getNamedAccounts();
  console.log("deployer: ", deployer);
  // chainId
  const chainId = network.config.chainId;
  console.log("chainId: ", chainId);
  // 根据chainId判断喂价地址
  let ethUsdPriceFeedAddress;
  if (developmentChainIds.includes(chainId)) {
    // 本地环境使用自己MOCK的地址
    // 使用get获取部署的合约
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]?.ethUsdPriceFeed ?? "";
  }
  // 部署合约
  const args = [ethUsdPriceFeedAddress];
  log("部署FundMe合约");
  const fundMe = await deploy("FundMe", {
    // 部署合约的地址
    from: deployer,
    // 构造函数参数
    args,
    // 打开日志
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("FundMe合约部署完成");
  // 如果不是本地网络，自动进行验证
  if (!developmentChainIds.includes(chainId)) {
    await verify(fundMe.address, args);
  }
};

module.exports.tags = ["all", "fundme"];
