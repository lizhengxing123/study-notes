/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 14:41:00
 * @LastEditTime: 2022-11-06 16:05:34
 */
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
