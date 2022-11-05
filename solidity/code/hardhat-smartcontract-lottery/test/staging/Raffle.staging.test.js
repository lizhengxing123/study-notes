/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-04 18:32:33
 * @LastEditTime: 2022-11-05 23:15:53
 */
const { expect, assert } = require("chai")
const { ethers, getNamedAccounts, network, deployments } = require("hardhat")
const { developmentChainIds, networkConfig } = require("../../helper-hardhat-config")

const chainId = network.config.chainId

developmentChainIds.includes(parseInt(chainId))
    ? describe.skip
    : describe("Raffle Unit Tests", async () => {
          const currentNetworkConfig = networkConfig[chainId]
          const raffleEntranceFee = currentNetworkConfig.entranceFee

          let deployer, raffle

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
          })

          describe("fulfillRandomWords", () => {
              it("抽取获胜者，重置抽奖，并且发送金额", async () => {
                  const accounts = await ethers.getSigners()
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
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimestamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(parseInt(raffleState), 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      // 发送交易
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      const winnerStartingBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
