/*
 * @Descripttion: 部署Raffle合约
 * @Author: lizhengxing
 * @Date: 2022-11-03 20:33:59
 * @LastEditTime: 2022-11-03 22:10:31
 */

const { developmentChainIds, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ deployments, getNamedAccounts, network, getChainId, ethers }) => {
    const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")
    // deploy - 部署合约的方法
    // log - 日志打印
    const { deploy, log, get } = deployments
    // 部署账户
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let vrfCoordinatorV2Address, subscriptionId
    // 判断是否为开发环境
    if (developmentChainIds.includes(parseInt(chainId))) {
        // 开发环境 - 获取之前部署的 mock 地址
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        // 创建订阅id
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        // 给这个订阅充值
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        // 测试环境
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }
    const { entranceFee, gasLane, callbackGasLimit, interval } = networkConfig[chainId]

    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]
    // 部署Raffle合约
    const Raffle = await deploy("Raffle", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: network.config.blockConfirmations || 6,
    })

    // 不是开发环境，进行验证
    if (!developmentChainIds.includes(parseInt(chainId))) {
        await verify(Raffle.address, args)
    }

    log("----------------------------")
}

module.exports.tags = ["all", "raffle"]
