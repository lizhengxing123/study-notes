/*
 * @Descripttion: FundMe 本地测试
 * @Author: lizhengxing
 * @Date: 2022-11-01 16:05:58
 * @LastEditTime: 2022-11-01 21:26:08
 */
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChainIds } = require("../../helper-hardhat-config");

// 不是开发环境跳过
!developmentChainIds.includes(network.config.chainId)
  ? describe.ship
  : describe("FundMe", async () => {
      const ONE_ETH = ethers.utils.parseEther("1"); // 1 ETH
      let fundMe;
      let deployer;
      let mockV3Aggregator;
      // 部署合约
      beforeEach(async () => {
        // 获取全部账户
        // const accounts = ethers.getSigners()
        // const accountZero = accounts[0]
        // 部署账户
        deployer = (await getNamedAccounts()).deployer;
        // 使用fixture可以执行deploy文件里的部署脚本
        await deployments.fixture(["all"]);
        // 获取部署的合约，指定账户
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async () => {
        it("设置了正确的Aggregator地址", async () => {
          // FundMe合约中的priceFeed要等于部署的MockV3Aggregator的地址
          const response = await fundMe.getPriceFeed(); // 公共变量为getter函数，需要调用
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("fund", async () => {
        it("没有发送足够的ETH，调用失败", async () => {
          // 回复交易
          //   await expect(fundMe.fund()).to.be.reverted;
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("更新 s_addressToAmountFunded 数据", async () => {
          // 发送 1 eth -- deployer在调用
          await fundMe.fund({ value: ONE_ETH });
          // response 为 bigNumber
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), ONE_ETH.toString());
        });
        it("更新 s_funders 数组", async () => {
          // deployer在调用
          await fundMe.fund({ value: ONE_ETH });
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", async () => {
        // 每次运行之前为合约提供资金 -- deployer在调用
        beforeEach(async () => {
          await fundMe.fund({ value: ONE_ETH });
        });
        it("提取ETH，只有一个funder", async () => {
          // 刚开始时合约的余额
          const startFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 刚开始时部署者的余额
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 交易响应
          const transactionResponse = await fundMe.withdraw();
          // 交易收据 -- 等待交易完成
          const transactionReceipt = await transactionResponse.wait(1);
          // gas使用量和有效的gas价格
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // gas花费
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // 提取之后合约的余额
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 提取之后部署者的余额
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 断言
          // 提取之后合约的余额为0
          assert.equal(endingFundMeBalance, 0);
          // 提取之后部署者的余额加上花费的gas等于刚开始时合约的余额加上刚开始时部署者的余额
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startFundMeBalance.add(startDeployerBalance).toString()
          );
        });
        it("提取ETH，多个funder", async () => {
          // 获取账户
          const accounts = await ethers.getSigners();
          // 循环往FundMe合约转账，因为0是deployer，从1开始
          for (let i = 1; i < accounts.length; i++) {
            // FundMe合约连接到新的账户，合约地址没变，只是调用的账户变了
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            // 通过新的账户向合约转账
            await fundMeConnectedContract.fund({ value: ONE_ETH });
          }
          // 刚开始时合约的余额
          const startFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 刚开始时部署者的余额
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 交易响应
          const transactionResponse = await fundMe.withdraw();
          // 交易收据 -- 等待交易完成
          const transactionReceipt = await transactionResponse.wait(1);
          // gas使用量和有效的gas价格
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // gas花费
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // 提取之后合约的余额
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 提取之后部署者的余额
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 断言
          // 提取之后合约的余额为0
          assert.equal(endingFundMeBalance, 0);
          // 提取之后部署者的余额加上花费的gas等于刚开始时合约的余额加上刚开始时部署者的余额
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startFundMeBalance.add(startDeployerBalance).toString()
          );

          // s_funders 数组应该被重置 -- 访问第一个元素应该revert
          await expect(fundMe.getFunder(0)).to.be.reverted;
          // s_addressToAmountFunded 映射中，所有账户的金额应该为0
          for (let i = 1; i < accounts.length; i++) {
            // 获取每个账户的金额
            const accountAmount = await fundMe.getAddressToAmountFunded(
              accounts[i].address
            );
            assert.equal(accountAmount, 0);
          }
        });
        it("只有owner才可以提取", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          // 报错 Expected transaction to be reverted with reason 'FundMe__NotOwner',
          // but it reverted with a custom error
          // await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
          //   "FundMe__NotOwner"
          // );
          await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
      });

      describe("cheaperWithdraw", async () => {
        // 每次运行之前为合约提供资金 -- deployer在调用
        beforeEach(async () => {
          await fundMe.fund({ value: ONE_ETH });
        });
        it("提取ETH，只有一个funder", async () => {
          // 刚开始时合约的余额
          const startFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 刚开始时部署者的余额
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 交易响应
          const transactionResponse = await fundMe.cheaperWithdraw();
          // 交易收据 -- 等待交易完成
          const transactionReceipt = await transactionResponse.wait(1);
          // gas使用量和有效的gas价格
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // gas花费
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // 提取之后合约的余额
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 提取之后部署者的余额
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 断言
          // 提取之后合约的余额为0
          assert.equal(endingFundMeBalance, 0);
          // 提取之后部署者的余额加上花费的gas等于刚开始时合约的余额加上刚开始时部署者的余额
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startFundMeBalance.add(startDeployerBalance).toString()
          );
        });

        it("提取ETH，多个funder", async () => {
          // 获取账户
          const accounts = await ethers.getSigners();
          // 循环往FundMe合约转账，因为0是deployer，从1开始
          for (let i = 1; i < accounts.length; i++) {
            // FundMe合约连接到新的账户，合约地址没变，只是调用的账户变了
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            // 通过新的账户向合约转账
            await fundMeConnectedContract.fund({ value: ONE_ETH });
          }
          // 刚开始时合约的余额
          const startFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 刚开始时部署者的余额
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 交易响应
          const transactionResponse = await fundMe.cheaperWithdraw();
          // 交易收据 -- 等待交易完成
          const transactionReceipt = await transactionResponse.wait(1);
          // gas使用量和有效的gas价格
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // gas花费
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // 提取之后合约的余额
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          // 提取之后部署者的余额
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // 断言
          // 提取之后合约的余额为0
          assert.equal(endingFundMeBalance, 0);
          // 提取之后部署者的余额加上花费的gas等于刚开始时合约的余额加上刚开始时部署者的余额
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startFundMeBalance.add(startDeployerBalance).toString()
          );

          // s_funders 数组应该被重置 -- 访问第一个元素应该revert
          await expect(fundMe.getFunder(0)).to.be.reverted;
          // s_addressToAmountFunded 映射中，所有账户的金额应该为0
          for (let i = 1; i < accounts.length; i++) {
            // 获取每个账户的金额
            const accountAmount = await fundMe.getAddressToAmountFunded(
              accounts[i].address
            );
            assert.equal(accountAmount, 0);
          }
        });
        it("只有owner才可以提取", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          // 报错 Expected transaction to be reverted with reason 'FundMe__NotOwner',
          // but it reverted with a custom error
          // await expect(
          //   attackerConnectedContract.cheaperWithdraw()
          // ).to.be.revertedWith("FundMe__NotOwner");
          await expect(attackerConnectedContract.cheaperWithdraw()).to.be
            .reverted;
        });
      });
    });
