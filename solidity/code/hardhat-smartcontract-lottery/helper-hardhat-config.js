/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 20:16:03
 * @LastEditTime: 2022-11-04 22:03:18
 */

const { ethers } = require("hardhat")

// 网络配置
const networkConfig = {
    // goerli的chainId为5
    5: {
        // 名称
        name: "goerli",
        // vrfCoordinator地址
        vrfCoordinatorV2: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "6029",
        callbackGasLimit: "500000",
        interval: "30",
    },
    31337: {
        // 名称
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        interval: "30",
    },
}
// 本地开发链
const developmentChainIds = [31337]

module.exports = {
    networkConfig,
    developmentChainIds,
}
