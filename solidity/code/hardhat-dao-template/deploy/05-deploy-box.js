/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-12 20:45:00
 * @LastEditTime: 2022-11-13 09:24:39
 */
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  log("---------- deploy box ----------");
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
  });
  log("---------- deployed box ----------");

  const timeLock = await ethers.getContract("TimeLock", deployer);
  const boxContract = await ethers.getContractAt("Box", box.address);
  // 转移
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);

  log("done !!!!");
};

module.exports.tags = ["all", "box"];
