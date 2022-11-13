/*
 * @Descripttion: 移动区块
 * @Author: lizhengxing
 * @Date: 2022-11-13 09:54:59
 * @LastEditTime: 2022-11-13 11:08:51
 */
const { network } = require("hardhat");

async function moveBlocks(amount) {
  console.log("Moving Blocks...");
  for (let i = 0; i < amount; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} Blocks successfully`);
}

module.exports = {
  moveBlocks,
};
