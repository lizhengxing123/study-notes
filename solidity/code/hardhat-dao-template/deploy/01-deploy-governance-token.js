/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-12 20:45:00
 * @LastEditTime: 2022-11-12 21:16:30
 */
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  log("---------- deploy governance token ----------");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
  });
  log("---------- deployed governance token ----------");
  await delegate(governanceToken.address, deployer);
};

const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `check points ${await governanceToken.numCheckpoints(delegatedAccount)} `
  );
};

module.exports.tags = ["all", "governanceToken"];
