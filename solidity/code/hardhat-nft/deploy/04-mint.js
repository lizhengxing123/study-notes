/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-08 20:14:52
 * @LastEditTime: 2022-11-08 21:22:15
 */
const { developmentChainIds } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, ethers }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // basic nft
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`basic nft index 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    // random ipfs nft
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsMintTx = await randomIpfsNft.requestNft({ value: mintFee })
    const randomIpfsMintTxReceipt = await randomIpfsMintTx.wait(1)
    // 需要监听交易完成
    await new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            reject("超过5分钟")
        }, 300000)
        randomIpfsNft.once("NftMinted", async () => {
            resolve()
        })
        try {
            if (developmentChainIds.includes(parseInt(chainId))) {
                const vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
                const requestId = randomIpfsMintTxReceipt.events[1].args.requestId.toString()
                // 开发环境需要手动调用fulfillRandomWords函数
                await vrfCoordinatorV2.fulfillRandomWords(requestId, randomIpfsNft.address)
            }
        } catch (error) {
            reject(error)
        }
    })

    // dynamic svg nft
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgMintTx = await dynamicSvgNft.mintNft(ethers.utils.parseEther("4000"))
    await dynamicSvgMintTx.wait(1)
    console.log(`dynamic svg nft index 0 has tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)
}

module.exports.tags = ["all", "mint"]
