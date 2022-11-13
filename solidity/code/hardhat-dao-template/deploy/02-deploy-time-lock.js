/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-12 20:45:00
 * @LastEditTime: 2022-11-12 21:52:34
 */
const { MIN_DELAY } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  log("---------- deploy time lock ----------");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
  });
  log("---------- deployed time lock ----------");
};

module.exports.tags = ["all", "timeLock"];
