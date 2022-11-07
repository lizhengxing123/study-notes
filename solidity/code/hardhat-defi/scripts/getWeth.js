/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 20:34:51
 * @LastEditTime: 2022-11-07 09:41:32
 */
const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const { deployer } = await getNamedAccounts()
    // 在 weth 合约上调用 deposit 函数
    // 获取 weth 合约需要 abi 和合约地址
    // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iWeth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    // deposit - 向我们自己的账户存入weth
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    // 20000000000000000 => 0.02ETH
    console.log("wethBalance: ", wethBalance.toString())
}

module.exports = {
    getWeth,
    AMOUNT,
}
