/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-07 15:04:14
 * @LastEditTime: 2022-11-08 21:07:58
 */

module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    log("---- deploying basic nft ----")
    await deploy("BasicNft", {
        from: deployer,
        log: true,
        args: [],
        awaitConfirmations: network.config.blockConfirmations || 1,
    })
    log("---- deployed basic nft ----")
}

module.exports.tags = ["all", "basicNft", "main"]
