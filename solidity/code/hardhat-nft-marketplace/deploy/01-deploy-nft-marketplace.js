/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 14:43:46
 * @LastEditTime: 2022-11-09 14:52:16
 */
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log(`--------- deploying nft marketplace ---------`)
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`--------- deployed nft marketplace ---------`)
}

module.exports.tags = ["all", "nftMarketplace"]
