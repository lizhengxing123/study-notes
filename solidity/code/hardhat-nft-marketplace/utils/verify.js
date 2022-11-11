/*
 * @Descripttion: 合约验证函数
 * @Author: lizhengxing
 * @Date: 2022-10-31 21:29:24
 * @LastEditTime: 2022-10-31 21:57:22
 */
const { run } = require("hardhat");

/**
 * @name:
 * @param { String } contractAddress 合约地址
 * @param { Array } args 构造函数参数
 * @return {*}
 */
const verify = async (contractAddress, args) => {
  console.log("开始验证");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("验证成功");
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified", e);
    } else {
      console.log("Error", e);
    }
  }
};
module.exports = verify;
