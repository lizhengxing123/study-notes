/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-11 20:54:24
 * @LastEditTime: 2022-11-12 14:17:59
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("------------ deploy box ------------")
    await deploy("Box", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.confirmations || 1,
        proxy: {
            // 代理合约
            proxyContract: "OpenZeppelinTransparentProxy",
            // 管理员合约 - 用于执行升级
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    })
    log("------------ deployed box ------------")
}

module.exports.tags = ["all", "box"]
