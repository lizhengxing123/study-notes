/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-07 15:04:14
 * @LastEditTime: 2022-11-08 21:07:53
 */
const fs = require("fs")
const { developmentChainIds, networkConfig } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments, network, ethers }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    const currentNetworkConfig = networkConfig[chainId]
    let priceFeedAddress
    if (developmentChainIds.includes(parseInt(chainId))) {
        const priceFeed = await ethers.getContract("MockV3Aggregator")
        priceFeedAddress = priceFeed.address
    } else {
        priceFeedAddress = currentNetworkConfig.ethUsdPriceFeed
    }
    const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", {
        encoding: "utf-8",
    })
    const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", {
        encoding: "utf-8",
    })
    log("---- deploying dynamic svg nft ----")
    await deploy("DynamicSvgNft", {
        from: deployer,
        log: true,
        args: [priceFeedAddress, lowSvg, highSvg],
        awaitConfirmations: network.config.blockConfirmations || 1,
    })
    log("---- deployed dynamic svg nft ----")
}

module.exports.tags = ["all", "dynamicSvgNft", "main"]
