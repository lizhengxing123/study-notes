/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-11 20:54:24
 * @LastEditTime: 2022-11-12 14:22:59
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    log("------------ deploy boxv2 ------------")
    await deploy("BoxV2", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.confirmations || 1,
    })
    log("------------ deployed boxv2 ------------")
}

module.exports.tags = ["all", "boxv2"]
