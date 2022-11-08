/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-07 15:04:14
 * @LastEditTime: 2022-11-08 21:08:05
 */

const { developmentChainIds } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, network, ethers }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const BASE_FEE = ethers.utils.parseEther("0.25")
    const GAS_PRICE_LINK = 1e9
    const DECIMALS = "18"
    const INITIAL_PRICE = ethers.utils.parseEther("2000")
    const chainId = network.config.chainId
    if (developmentChainIds.includes(parseInt(chainId))) {
        log("---- deploying vrf coordinator ----")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
            awaitConfirmations: network.config.blockConfirmations || 1,
        })
        log("---- deployed vrf coordinator ----")

        log("---- deploying price feed ----")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
            awaitConfirmations: network.config.blockConfirmations || 1,
        })
        log("---- deployed price feed ----")
    }
}

module.exports.tags = ["all", "mocks", "main"]
