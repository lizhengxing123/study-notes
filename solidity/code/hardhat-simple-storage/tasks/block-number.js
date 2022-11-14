/*
 * @Descripttion: 自定义任务
 * @Author: lizhengxing
 * @Date: 2022-10-29 20:35:18
 * @LastEditTime: 2022-11-14 22:20:32
 */
const { task, subtask } = require("hardhat/config");

task("block-number", "Prints the current block number")
  .addParam("param1", "param1 description")
  .addOptionalParam("param2", "param2 description", 1, types.int)
  .setAction(async (taskArgs, hre) => {
    console.log("taskArgs111: ", taskArgs);
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("blockNumber: ", blockNumber);
  });

task(
  "block-number",
  "Prints the current block number",
  async (taskArgs, hre, runSuper) => {
    console.log("taskArgs222: ", taskArgs);
    runSuper();
    if (taskArgs.param2 > 3) {
      // console.log((await hre.ethers.getSigners())[0].address);
      console.log(10);
    }
  }
);

subtask("print", "Prints a message")
  .addParam("message", "The message to print")
  .setAction(async (taskArgs) => {
    console.log(taskArgs.message);
  });

module.exports = {};
