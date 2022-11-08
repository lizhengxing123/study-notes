/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-07 15:13:06
 * @LastEditTime: 2022-11-08 16:57:41
 */
const { assert } = require("chai")
const { ethers, getNamedAccounts, deployments } = require("hardhat")

describe("BasicNft", () => {
    let deployer, basicNft
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        basicNft = await ethers.getContract("BasicNft", deployer)
    })

    describe("constructor", () => {
        it("Should tokenCounter to be zero", async () => {
            const tokenCounter = await basicNft.getTokenCounter()
            assert.equal(tokenCounter.toString(), "0")
        })
    })

    describe("mintNft", () => {
        it("Should tokenCounter to be equal 1", async () => {
            const txResponse = await basicNft.callStatic.mintNft()
            await txResponse.wait(1)
            const tokenCounter = await basicNft.getTokenCounter()
            assert.equal("1", tokenCounter.toString())
        })
    })

    describe("tokenURI", () => {
        it("Should tokenURI function return value will be constant", async () => {
            const uri = await basicNft.TOKEN_URI()
            const uriFromCall = await basicNft.tokenURI(0)
            assert.equal(uri, uriFromCall.toString())
        })
    })
})
