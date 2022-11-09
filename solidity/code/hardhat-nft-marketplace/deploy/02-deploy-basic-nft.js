/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 14:43:46
 * @LastEditTime: 2022-11-09 15:06:16
 */
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log(`--------- deploying basic nft ---------`)
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`--------- deployed basic nft ---------`)
}

module.exports.tags = ["all", "basicNft"]
