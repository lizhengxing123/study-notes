/*
 * @Descripttion: 升级合约
 * @Author: lizhengxing
 * @Date: 2022-11-11 21:37:57
 * @LastEditTime: 2022-11-12 14:45:07
 */
const { ethers } = require("hardhat")

async function main() {
    // 代理管理
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    // 透明代理
    const transparentProxy = await ethers.getContract("Box_Proxy")
    // 在透明代理的地址上获得 BoxV1
    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address)
    const versionV1 = await proxyBoxV1.version()
    console.log("versionV1: ", versionV1)
    // BoxV2
    const boxV2 = await ethers.getContract("BoxV2")
    // 升级
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)
    // 在透明代理的地址上获得 BoxV2
    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const versionV2 = await proxyBoxV2.version()
    console.log("versionV2: ", versionV2)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("error: ", error)
        process.exit(1)
    })
