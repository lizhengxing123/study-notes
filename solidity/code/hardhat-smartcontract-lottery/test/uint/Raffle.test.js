/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-04 18:32:33
 * @LastEditTime: 2022-11-04 21:33:27
 */
const { expect, assert } = require("chai")
const { ethers, getNamedAccounts, network, deployments } = require("hardhat")
const { developmentChainIds, networkConfig } = require("../../helper-hardhat-config")

const chainId = network.config.chainId

!developmentChainIds.includes(parseInt(chainId))
    ? describe.skip
    : describe("Raffle Unit Tests", async () => {
          const currentNetworkConfig = networkConfig[chainId]
          const raffleEntranceFee = currentNetworkConfig.entranceFee

          let deployer, raffle, vrfCoordinatorV2Mock

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", () => {
              it("正确初始化抽奖", async () => {
                  const raffleState = await raffle.getRaffleState()
                  const raffleInterval = await raffle.getInterval()
                  const vrfCoordinator = await raffle.getVrfCoordinator()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(raffleInterval.toString(), currentNetworkConfig.interval)
                  assert.equal(vrfCoordinator, vrfCoordinatorV2Mock.address)
              })
          })

          describe("加入抽奖", () => {
              it("支付金额不足时，重置交易", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered"
                  )
              })

              it("记录加入的玩家", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert(playerFromContract, deployer)
              })

              it("加入抽奖触发事件", async () => {
                  // 触发事件
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee }))
                      .to.emit(raffle, "RaffleEnter")
                      .withArgs(deployer)
              })

              it("抽奖为计算状态，不允许加入", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  // 时间加速
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  // 挖块
                  await network.provider.send("evm_mine", [])
                  // 手动调用 -- 变成计算状态
                  await raffle.performUpkeep([])
                  // 计算状态不允许加入 -- 需要给协作合约添加consumer（Raffle合约地址），否则会报错
                  // reverted with custom error 'InvalidConsumer()'
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__NotOpen"
                  )
              })
          })

          describe("checkUpKeep", () => {
              it("抽奖人没发送ETH，返回false", async () => {
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  /**
                   * callStatic - ethers contract 提供的方法
                   * 这实际上不会改变任何状态，而是免费的。在某些情况下，这可以用于确定事务是成功还是失败。
                   */
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(!upkeepNeeded)
              })

              it("抽奖不是打开状态，返回false", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep([])
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert.equal(raffleState.toString(), "1")
                  assert.equal(upkeepNeeded, false)
              })

              it("时间间隔不够，返回false", async () => {
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) - 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  assert.equal(upkeepNeeded, false)
              })

              it("满足条件，返回true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", () => {
              it("checkUpkeep判断为真，才能执行", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const tx = await raffle.performUpkeep([])
                  // 有交易响应就为真 - 没有就是被revert了
                  assert(tx)
              })

              it("checkUpkeep判断为假，revert", async () => {
                  await expect(raffle.performUpkeep([])).to.be.revertedWith(
                      "Raffle__UpKeepNotNeeded"
                  )
              })

              it("更新抽奖状态，请求随机数并且触发事件", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
                  const txResponse = await raffle.performUpkeep([])
                  const txReceipt = await txResponse.wait(1)
                  // 下面两种方式都能拿到requestId，因为请求协作合约的函数里面也有时间
                  // 所以我们自己定义的事件时第二个
                  //   console.log("txReceipt: ", txReceipt.events[1].args[0])
                  //   console.log("txReceipt: ", txReceipt.events[1].args.requestId)
                  const requestId = txReceipt.events[1].args.requestId
                  const raffleState = await raffle.getRaffleState()
                  assert(parseInt(requestId) > 0)
                  assert.equal(raffleState.toString(), "1")
              })
          })

          describe("fulfillRandomWords", () => {
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      parseInt(currentNetworkConfig.interval) + 1,
                  ])
                  await network.provider.send("evm_mine", [])
              })

              it("抽取获胜者，重置抽奖，并且发送金额", async () => {
                  // 多增加几个参与抽奖的人，加上beforeEach里面的deployer一共4个
                  const additionalEntrances = 3
                  const startAccountIndex = 1 // deploy = 0
                  const accounts = await ethers.getSigners()
                  for (
                      let i = startAccountIndex;
                      i < startAccountIndex + additionalEntrances;
                      i++
                  ) {
                      const accountConnectedRaffle = raffle.connect(accounts[i])
                      accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }
                  const startingTimeStamp = await raffle.getLatestTimestamp()
                  // 需要等待拿到随机数
                  await new Promise(async (resolve, reject) => {
                      // 监听事件触发
                      raffle.once("WinnerPicked", async () => {
                          console.log("事件触发")
                          try {
                              // 事件触发之后，状态变量已经改变
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const endingTimeStamp = await raffle.getLatestTimestamp()
                              const numPlayers = await raffle.getNumberOfPlayers()
                              // 初始金额 + 3个人的入场费 + 部署者的入场费（beforeEach）
                              const winnerEndingBalance = await accounts[1].getBalance()
                              assert.equal(numPlayers.toString(), "0")
                              assert.equal(raffleState.toString(), "0")
                              assert(parseInt(endingTimeStamp) > parseInt(startingTimeStamp))
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance
                                      .add(raffleEntranceFee.mul(additionalEntrances))
                                      .add(raffleEntranceFee)
                                      .toString()
                              )
                          } catch (error) {
                              reject(error)
                          }
                          resolve()
                      })
                      // 触发自动化执行函数 - 会调用协作合约的请求随机数函数
                      const txResponse = await raffle.performUpkeep([])
                      const txReceipt = await txResponse.wait(1)
                      const winnerStartingBalance = await accounts[1].getBalance()
                      // 请求随机数函数调用成功 ->
                      // 触发协作合约接收随机数函数 ->
                      // 然后协作合约的这个函数会调用我们的接收随机数函数 ->
                      // 事件触发
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          raffle.address
                      )
                  })
              })
          })
      })
