/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 15:49:22
 * @LastEditTime: 2022-11-06 16:34:56
 */
const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

describe("ManualToken", () => {
  const initialSupplyArg = 50;
  const nameArg = "ManualToken";
  const symbolArg = "MT";

  let manualToken, deployer;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["mt"]);
    manualToken = await ethers.getContract("ManualToken", deployer);
  });
  describe("constructor", () => {
    it("更新数据", async () => {
      const decimals = await manualToken.decimals();
      const initialSupply = await manualToken.totalSupply();
      const creatorBalance = await manualToken.balanceOf(deployer);
      assert(
        initialSupply.toString(),
        (initialSupplyArg * 10 * decimals).toString()
      );
      assert(creatorBalance.toString(), initialSupply.toString());
    });
  });
  describe("transfer", () => {
    let accountOne, accountTwo;
    beforeEach(async () => {
      const accounts = await ethers.getSigners();
      accountOne = accounts[1];
      accountTwo = accounts[2];
    });
    it("approve", async () => {
      const txResponse = await manualToken.approve(accountOne.address, "10");
      const txReceipt = await txResponse.wait(1);
      assert(txReceipt.events[0].args[0], deployer.address);
      assert(txReceipt.events[0].args[1], accountOne.address);
      assert(txReceipt.events[0].args[2].toString(), "10");
    });
    it("transfer revert", async () => {
      const txResponse = await manualToken.approve(accountOne.address, "10");
      await txResponse.wait(1);
      const allowance = await manualToken.allowance(
        deployer,
        accountOne.address
      );
      console.log("allowance: ", allowance.toString());
      const connectedOneManualToken = await manualToken.connect(accountOne);
      await connectedOneManualToken.transferFrom(
        deployer,
        accountTwo.address,
        "9"
      );
      const updateAllowance = await manualToken.allowance(
        deployer,
        accountOne.address
      );
      console.log("updateAllowance: ", updateAllowance.toString());
    });
  });
});
