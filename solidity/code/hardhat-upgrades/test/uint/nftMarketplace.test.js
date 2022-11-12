/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 15:10:00
 * @LastEditTime: 2022-11-09 17:38:01
 */
const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChainIds } = require("../../helper-hardhat-config")

const chainId = network.config.chainId

!developmentChainIds.includes(parseInt(chainId))
    ? describe.skip
    : describe("NftMarketplace", () => {
          const PRICE = ethers.utils.parseEther("0.01")
          let deployer, player, nftMarketplace, basicNft, nftAddress, tokenId
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0] // (await getNamedAccounts()).deployer
              player = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace", deployer)
              basicNft = await ethers.getContract("BasicNft", deployer)
              nftAddress = basicNft.address
              const mintTxResponse = await basicNft.mintNft()
              const mintTxReceipt = await mintTxResponse.wait(1)
              tokenId = mintTxReceipt.events[1].args.tokenId
          })

          describe("listItem", () => {
              it("价格小于等于0，revert", async () => {
                  await expect(nftMarketplace.listItem(nftAddress, tokenId, 0)).to.be.revertedWith(
                      "NftMarketplace__PriceMustBeAboveZero()"
                  )
              })

              it("没有批准，revert", async () => {
                  await expect(
                      nftMarketplace.listItem(nftAddress, tokenId, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketplace()")
              })

              it("上架 NFT", async () => {
                  // approve
                  const approveTxResponse = await basicNft.approve(nftMarketplace.address, tokenId)
                  const approveTxReceipt = await approveTxResponse.wait(1)
                  await nftMarketplace.listItem(nftAddress, tokenId, PRICE)
                  const listing = await nftMarketplace.getListing(nftAddress, tokenId)
                  assert.equal(listing.seller, deployer.address)
                  assert.equal(listing.price.toString(), PRICE.toString())
                  //   await expect(nftMarketplace.listItem(nftAddress, tokenId, PRICE)).to.emit(
                  //       nftMarketplace,
                  //       "ItemListed"
                  //   )
              })

              it()
          })

          describe("buyItem", () => {
              beforeEach(async () => {
                  const approveTxResponse = await basicNft.approve(nftMarketplace.address, tokenId)
                  const approveTxReceipt = await approveTxResponse.wait(1)
                  await nftMarketplace.listItem(nftAddress, tokenId, PRICE)
              })
              it("金额不足，revert", async () => {
                  await expect(nftMarketplace.buyItem(nftAddress, tokenId, { value: 0 })).to.be
                      .reverted
              })
              it("购买 NFT", async () => {
                  const playerConnectedNftMarketplace = await nftMarketplace.connect(player)
                  await playerConnectedNftMarketplace.buyItem(nftAddress, tokenId, { value: PRICE })
                  const newOwner = await basicNft.ownerOf(tokenId)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
                  assert.equal(newOwner, player.address)
                  assert.equal(deployerProceeds.toString(), PRICE.toString())
              })
          })

          describe("updateListing", async () => {
              beforeEach(async () => {
                  const approveTxResponse = await basicNft.approve(nftMarketplace.address, tokenId)
                  const approveTxReceipt = await approveTxResponse.wait(1)
                  await nftMarketplace.listItem(nftAddress, tokenId, PRICE)
              })
              it("更新价格", async () => {
                  const newPrice = ethers.utils.parseEther("0.2")
                  await nftMarketplace.updateListing(nftAddress, tokenId, newPrice)
                  const newPriceFromCall = (await nftMarketplace.getListing(nftAddress, tokenId))
                      .price
                  assert.equal(newPriceFromCall.toString(), newPrice.toString())
              })
          })

          describe("cancelListing", async () => {
              beforeEach(async () => {
                  const approveTxResponse = await basicNft.approve(nftMarketplace.address, tokenId)
                  const approveTxReceipt = await approveTxResponse.wait(1)
                  await nftMarketplace.listItem(nftAddress, tokenId, PRICE)
              })
              it("下架 NFT", async () => {
                  await expect(nftMarketplace.cancelListing(nftAddress, tokenId)).to.emit(
                      nftMarketplace,
                      "itemCanceled"
                  )
              })
          })

          describe("withdrawProceeds", async () => {
              let playerConnectedNftMarketplace
              beforeEach(async () => {
                  const approveTxResponse = await basicNft.approve(nftMarketplace.address, tokenId)
                  const approveTxReceipt = await approveTxResponse.wait(1)
                  await nftMarketplace.listItem(nftAddress, tokenId, PRICE)
                  playerConnectedNftMarketplace = await nftMarketplace.connect(player)
                  await playerConnectedNftMarketplace.buyItem(nftAddress, tokenId, { value: PRICE })
              })
              it("没有收益的账户提取，revert", async () => {
                  await expect(playerConnectedNftMarketplace.withdrawProceeds()).to.be.reverted
              })
              it("提取收益", async () => {
                  const tx = await nftMarketplace.withdrawProceeds()
                  await tx.wait(1)
                  const endProceeds = await nftMarketplace.getProceeds(deployer.address)
                  assert.equal("0", endProceeds.toString())
              })
          })
      })
