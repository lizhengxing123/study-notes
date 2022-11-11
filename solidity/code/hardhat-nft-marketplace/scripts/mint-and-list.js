/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 17:36:28
 * @LastEditTime: 2022-11-10 21:18:59
 */
const { ethers } = require("hardhat")
async function mintAndList() {
    const basicNft = await ethers.getContract("BasicNft")
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    console.log("Minting ...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(6)
    const tokenId = mintTxReceipt.events[1].args.tokenId

    console.log("Approving ...")
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approveTx.wait(6)

    console.log("Listing ...")
    const listTx = await nftMarketplace.listItem(
        basicNft.address,
        tokenId,
        ethers.utils.parseEther("0.01")
    )
    await listTx.wait(6)

    console.log("Complete!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("error: ", error)
        process.exit(1)
    })
