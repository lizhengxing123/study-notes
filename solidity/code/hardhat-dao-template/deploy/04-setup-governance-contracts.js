/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-12 20:45:00
 * @LastEditTime: 2022-11-13 11:39:43
 */
const { ethers } = require("hardhat");

const { ADDRESS_ZERO } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer, player } = await getNamedAccounts();
  console.log("deployer: ", deployer);
  const { deploy, log, get } = deployments;
  const timeLock = await ethers.getContract("TimeLock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);

  log("setting up roles...");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
  // 设置角色
  // 提议者
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(1);
  // 执行者设为空地址 - 零值会报错
  const executorTx = await timeLock.grantRole(
    executorRole,
    ADDRESS_ZERO /*ADDRESS_ZERO*/
  );
  await executorTx.wait(1);
  // 撤销管理员
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

module.exports.tags = ["all", "setupContracts"];
