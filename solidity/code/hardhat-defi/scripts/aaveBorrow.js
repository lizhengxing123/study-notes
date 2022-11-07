/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 20:20:25
 * @LastEditTime: 2022-11-07 12:15:59
 */
const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth.js")

async function main() {
    // deposit - 向我们自己的账户存入weth
    await getWeth()
    const { deployer } = await getNamedAccounts()
    // lending pool address provider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    const lendingPool = await getLendingPool(deployer)

    // approve - 批准lendingPool从我们的账户可以提取的weth数量，需要用到ERC20里的approve
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)

    // 向lendingPool里面存款
    lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("deposited")

    // borrow - 借出
    // 借了多少
    // 有多少的抵押
    // 能借多少
    const { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer)
    // dai的ETH价值 - 631435849077665
    const daiPrice = await getDai()
    console.log("daiPrice: ", daiPrice.toString())
    // 能借出多少dai，只借95% -- 24.824374515473565
    const amountDaiToBorrow = (availableBorrowsETH.toString() * 0.95) / daiPrice.toString()
    console.log("amountDaiToBorrow: ", amountDaiToBorrow)
    // 这些能借出的dai转化为wei 24824374515473565000
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    console.log("amountDaiToBorrowWei: ", amountDaiToBorrowWei.toString())
    // borrow
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer)
    // repay
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}

async function borrowDai(daiAddress, lendingPool, amountDaiToBorrowWei, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowWei, 1, 0, account)
    await borrowTx.wait(1)
    console.log("borrowed")
}

async function repay(amount, daiAddress, lendingPool, account) {
    // 批准lendingPool.address提取数量
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    await repayTx.wait(1)
    console.log("repaid")
}

async function getLendingPool(account) {
    // 获取 lending pool provider
    // 需要地址，abi
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    console.log("lendingPoolAddress: ", lendingPoolAddress)
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    } = await lendingPool.getUserAccountData(account)
    console.log("总抵押金额: ", totalCollateralETH.toString())
    console.log("总债务金额: ", totalDebtETH.toString())
    console.log("剩余借贷金额: ", availableBorrowsETH.toString())
    // console.log("清算阈值: ", currentLiquidationThreshold.toString())
    // console.log("贷款价值: ", ltv.toString())
    // console.log("健康系数: ", healthFactor.toString())
    return { availableBorrowsETH, totalDebtETH }
}

async function approveErc20(contractAddress, spenderAddress, amountToSpend, account) {
    const erc20 = await ethers.getContractAt("IERC20", contractAddress, account)
    await erc20.approve(spenderAddress, amountToSpend)
}

async function getDai() {
    // 不需要连接账户，因为无需发送交易
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const decimals = await daiEthPriceFeed.decimals()
    console.log("decimals: ", decimals.toString())
    // 是一个数组
    const price = await daiEthPriceFeed.latestRoundData()
    return price[1]
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log("err: ", err)
        process.exit(1)
    })
