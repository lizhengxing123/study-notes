/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-03 20:55:01
 * @LastEditTime: 2022-11-03 21:40:07
 */

const { developmentChainIds } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments, getChainId, network, ethers }) => {
    const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 LINK
    const GAS_PRICE_LINK = 1e9 // 一个计算值，基于链的价格
    const args = [BASE_FEE, GAS_PRICE_LINK]
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    // 本地环境部署
    if (developmentChainIds.includes(parseInt(chainId))) {
        log("本地开发环境，开始部署 Mock 合约...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args,
        })
        log("VRFCoordinatorV2Mock 部署完成")
        log("----------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
