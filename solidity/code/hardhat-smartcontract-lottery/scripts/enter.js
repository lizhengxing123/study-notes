/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-05 19:06:13
 * @LastEditTime: 2022-11-05 19:06:16
 */
const { ethers } = require("hardhat")

async function enterRaffle() {
    const raffle = await ethers.getContract("Raffle")
    const entranceFee = await raffle.getEntranceFee()
    await raffle.enterRaffle({ value: entranceFee + 1 })
    console.log("Entered!")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
