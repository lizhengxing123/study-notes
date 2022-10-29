/*
 * @Descripttion: 自定义任务
 * @Author: lizhengxing
 * @Date: 2022-10-29 20:35:18
 * @LastEditTime: 2022-10-29 20:47:36
 */
const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("blockNumber: ", blockNumber);
  }
);

module.exports = {};
