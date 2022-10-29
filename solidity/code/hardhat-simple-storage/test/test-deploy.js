/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-29 21:16:52
 * @LastEditTime: 2022-10-29 21:45:37
 */
const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
describe("SimpleStorage", () => {
  let SimpleStorage, simpleStorage;
  // 每次测试运行之前部署合约
  beforeEach(async () => {
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
  });

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });

  it("Should update when we call store", async () => {
    const expectedValue = "12";
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);
    const updateValue = await simpleStorage.retrieve();
    // assert
    assert.equal(updateValue.toString(), expectedValue);
    // expect -- 效果一样
    // expect(updateValue.toString()).to.equal(expectedValue);
  });
});
