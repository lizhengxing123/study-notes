/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 20:16:03
 * @LastEditTime: 2022-10-31 21:26:36
 */
// 网络配置
const networkConfig = {
  // goerli的chainId为5
  5: {
    // 名称
    name: "goerli",
    // 喂价地址 eth/usd
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};
// 本地开发链
const developmentChainIds = [31337];
// 模拟eth/usd喂价合约args
const DECIMALS = "8"; // 小数
const INITIAL_ANSWER = "200000000000"; // 初始答案

module.exports = {
  networkConfig,
  developmentChainIds,
  DECIMALS,
  INITIAL_ANSWER,
};
