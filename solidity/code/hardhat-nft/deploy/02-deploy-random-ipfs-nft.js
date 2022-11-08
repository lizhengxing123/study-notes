/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-07 15:04:14
 * @LastEditTime: 2022-11-08 21:07:50
 */

const { developmentChainIds, networkConfig } = require("../helper-hardhat-config")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
// 路径相对于hardhat-nft文件根目录
const imagesLocation = "./images/randomNft"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "",
            value: "",
        },
    ],
}

const tokenUris = [
    "ipfs://QmcQRYUkuQz1xaxxUHJ21EHDXRKmH4bdN81QFLkR4FNWpT",
    "ipfs://QmSs3H17keo8gNLpT7enMZv39f4vmoyodYs5urRuFdXVEE",
    "ipfs://QmVcjVjPQiJzqucWtadPFg4dTf1oDMV1E4Z4kGzGAryTAd",
]

module.exports = async ({ getNamedAccounts, deployments, network, ethers }) => {
    const FUND_AMOUNT = ethers.utils.parseEther("10")

    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    const chainId = network.config.chainId

    const currentNetworkConfig = networkConfig[chainId]
    const callbackGasLimit = currentNetworkConfig.callbackGasLimit
    const gasLane = currentNetworkConfig.gasLane
    const mintFee = currentNetworkConfig.mintFee

    let vrfCoordinatorV2Address, subId, vrfCoordinatorV2Mock

    if (process.env.UPLOAD_TO_PINATA === "true") {
        tokenUris = await handleTokenUris()
    }
    if (developmentChainIds.includes(parseInt(chainId))) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const txResponse = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await txResponse.wait(1)
        subId = txReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = currentNetworkConfig.vrfCoordinatorV2
        subId = currentNetworkConfig.subscriptionId
    }

    log("---- deploying random ipfs nft ----")
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        log: true,
        args: [vrfCoordinatorV2Address, callbackGasLimit, subId, gasLane, tokenUris, mintFee],
        awaitConfirmations: network.config.blockConfirmations || 1,
    })
    if (developmentChainIds.includes(parseInt(chainId))) {
        // 添加consumer
        await vrfCoordinatorV2Mock.addConsumer(subId, randomIpfsNft.address)
    }
    log("---- deployed random ipfs nft ----")
}

async function handleTokenUris() {
    let tokenUris = []
    const { responses: imageUploadResponses, dogImages: files } = await storeImages(imagesLocation)
    for (let imageUploadResponseIndex in imageUploadResponses) {
        const tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`uploading ${tokenUriMetadata.name} `)
        // 存储这些json数据
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log(`tokenuris uploaded`)
    console.log("tokenUris: ", tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomNft", "main"]
