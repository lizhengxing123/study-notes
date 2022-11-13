/*
 * @Descripttion: 移动区块
 * @Author: lizhengxing
 * @Date: 2022-11-13 09:54:59
 * @LastEditTime: 2022-11-13 11:14:32
 */
const { network } = require("hardhat");

async function moveTime(amount) {
  console.log("Moving Time...");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved ${amount} Seconds successfully`);
}

module.exports = {
  moveTime,
};
