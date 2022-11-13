/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-12 20:45:00
 * @LastEditTime: 2022-11-12 21:52:42
 */
const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");
  log("---------- deploy governor contract ----------");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
  });
  log("---------- deployed governor contract ----------");
};

module.exports.tags = ["all", "governorContract"];
