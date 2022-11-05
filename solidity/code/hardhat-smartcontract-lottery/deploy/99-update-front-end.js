/*
 * @Descripttion: 写入文件
 * @Author: lizhengxing
 * @Date: 2022-11-05 17:03:28
 * @LastEditTime: 2022-11-05 17:23:28
 */
const { ethers, network } = require("hardhat")

const fs = require("fs")
const FRONT_END_ADDRESS_FILE = "../nextjs-smartcontract-lottery/constants/contractAddress.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery/constants/abi.json"

module.exports = function () {
    if (process.env.UPDATE_FRONT_END) {
        updateContractAddress()
        updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const contractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf-8"))
    if (chainId in contractAddress) {
        if (!contractAddress[chainId].includes(raffle.address)) {
            contractAddress[chainId].push(raffle.address)
        }
    } else {
        contractAddress[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
