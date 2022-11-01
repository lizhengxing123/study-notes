/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-01 21:19:55
 * @LastEditTime: 2022-11-01 21:48:22
 */
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert } = require("chai");
const { developmentChainIds } = require("../../helper-hardhat-config");

// 开发环境跳过
developmentChainIds.includes(network.config.chainId)
  ? describe.skip
  : describe("FundMe", async () => {
      const ONE_ETH = ethers.utils.parseEther("1");
      let fundMe;
      let deployer;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("allows people to fund and withdraw", async () => {
        const fundTransactionResponse = await fundMe.fund({ value: ONE_ETH });
        await fundTransactionResponse.wait(1);
        const withdrawTransactionResponse = await fundMe.cheaperWithdraw();
        await withdrawTransactionResponse.wait(1);
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        );
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        );
        assert(endingFundMeBalance.toString, "0");
      });
    });
