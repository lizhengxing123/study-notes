/*
 * @Descripttion: NFT展示组件 - 所有者可以更新价格，其他人可以购买
 * @Author: lizhengxing
 * @Date: 2022-11-10 19:43:01
 * @LastEditTime: 2022-11-11 09:33:54
 */
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import NftMarketplaceAbi from "../constants/NftMarketplace.json"
import BasicNftAbi from "../constants/BasicNft.json"
import UpdateListingModal from "./UpdateListingModal"

// 截取字符串
const truncateString = (fullString, strLength) => {
    if (strLength >= fullString.length) return fullString

    const separator = "..."
    const separatorLength = separator.length
    const charsToShow = strLength - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullString.substring(0, frontChars) +
        separator +
        fullString.substring(fullString.length - backChars)
    )
}

export default function NFTBox({ nftAddress, tokenId, price, seller, marketplaceAddress }) {
    // tokenURI 的图像显示
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    // 更新价格弹框的显示
    const [showModal, setShowModal] = useState(false)
    // wallet 相关
    const { isWeb3Enabled, account } = useMoralis()
    // 通知
    const dispatch = useNotification()
    // 获取 tokenURI
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: BasicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId,
        },
    })
    // 购买 NFT
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        params: {
            nftAddress,
            tokenId,
        },
        msgValue: price,
    })
    // 更新 UI 界面显示
    const updateUI = async () => {
        const tokenURI = await getTokenURI()
        console.log("tokenURI: ", tokenURI)
        if (tokenURI) {
            // tokenURI 是一个 ipfs://... 地址
            // 我们需要将其变成 https://ipfs.io/ipfs/... 地址
            const requestURL = tokenURI.replace("ipfs://", "http://127.0.0.1:8083/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace(
                "https://ipfs.io/ipfs/",
                "http://127.0.0.1:8083/ipfs/"
            )
            setImageURI(imageURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }
    // 连接到 web3 之后更新 UI
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    // 当前用户是否为 NFT 所有者
    const isOwnerByUser = seller === account || !seller
    const formattedSellerAddress = isOwnerByUser ? "you" : truncateString(seller, 15)

    // 卡片点击
    // isOwnerByUser ? 更新价格 : 购买 NFT
    const handleCardClick = () => {
        isOwnerByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => {
                      console.log("error: ", error)
                      dispatch({
                          type: "error",
                          title: "购买失败",
                          message: "购买 NFT 失败，请重试",
                          position: "topR",
                          icon: "bell",
                      })
                  },
                  onSuccess: handleBuyItemSuccess,
              })
    }
    // 购买成功
    const handleBuyItemSuccess = async (tx) => {
        console.log("tx: ", tx)
        await tx.wait(6)
        dispatch({
            type: "success",
            title: "购买成功",
            message: "您已成功购买此 NFT",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="mr-8">
            {imageURI ? (
                <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                    <div className="p-2">
                        <div className="flex flex-col items-end gap-2">
                            <div>#{tokenId}</div>
                            <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                width="200"
                                height="200"
                            />
                            <div>{ethers.utils.formatEther(price)} ETH</div>
                        </div>
                    </div>
                </Card>
            ) : (
                <div>加载中...</div>
            )}
            <UpdateListingModal
                isVisible={showModal}
                setVisible={setShowModal}
                nftAddress={nftAddress}
                tokenId={tokenId}
                marketplaceAddress={marketplaceAddress}
            />
        </div>
    )
}
