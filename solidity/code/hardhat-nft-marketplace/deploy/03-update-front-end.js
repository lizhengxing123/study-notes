/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-10 10:34:36
 * @LastEditTime: 2022-11-10 19:50:58
 */
const fs = require("fs")
const { ethers, network } = require("hardhat")
// const frontEndContractsFile = "../nextjs-nft-marketplace-moralis-fcc/constants/networkMapping.json"
// const frontEndContractsFile2 =
//     "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json"
// const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis-fcc/constants/"
// const frontEndAbiLocation2 = "../nextjs-nft-marketplace-thegraph-fcc/constants/"
const FILE_PATH = "../nextjs-nft-marketplace-thegraph/constants/networkMapping.json"
const ABI_FILE_PATH = "../nextjs-nft-marketplace-thegraph/constants/"

const chainId = network.config.chainId.toString()

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        await updateContractAddress()
        await updateContractAbi()
    }
}

async function updateContractAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${ABI_FILE_PATH}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${ABI_FILE_PATH}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddress() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const contractAddresses = JSON.parse(
        fs.readFileSync(FILE_PATH, {
            encoding: "utf-8",
        })
    )
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].NftMarketplace.includes(nftMarketplace.address)) {
            contractAddresses[chainId].NftMarketplace.push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
        }
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
