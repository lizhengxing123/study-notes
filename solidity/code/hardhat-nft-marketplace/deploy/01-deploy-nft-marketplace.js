/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 14:43:46
 * @LastEditTime: 2022-11-10 16:55:55
 */
const verify = require("../utils/verify")
const { developmentChainIds } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId

    log(`--------- deploying nft marketplace ---------`)
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`--------- deployed nft marketplace ---------`)
    if (!developmentChainIds.includes(parseInt(chainId))) {
        await verify(nftMarketplace.address, [])
    }
}

module.exports.tags = ["all", "nftMarketplace"]
