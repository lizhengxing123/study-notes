/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 19:17:57
 * @LastEditTime: 2022-11-02 14:53:16
 */
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("get it back");
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
