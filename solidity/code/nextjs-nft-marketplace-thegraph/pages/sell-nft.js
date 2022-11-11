/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-05 13:21:45
 * @LastEditTime: 2022-11-11 16:15:02
 */
import { Form, useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import NftMarketplaceAbi from "../constants/NftMarketplace.json"
import BasicNftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import Proceeds from "../components/Proceeds"
import styles from "../styles/Home.module.css"

export default function Home() {
    const dispatch = useNotification()
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    // Approve Function
    const { runContractFunction: approve } = useWeb3Contract()
    // List Function
    const { runContractFunction: listItem } = useWeb3Contract()
    // 表单项
    const formFields = [
        {
            inputWidth: "50%",
            name: "NFT Address",
            type: "text",
            value: "",
            key: "nftAddress",
        },
        {
            inputWidth: "50%",
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
        },
        {
            inputWidth: "50%",
            name: "Price (ETH)",
            type: "number",
            value: "",
            key: "price",
        },
    ]
    // 提交方法
    const approveAndList = async (formData) => {
        const [nftAddress, tokenId, price] = formData.data.map((i) => i.inputResult)
        // Approve
        const approveOptions = {
            abi: BasicNftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId,
            },
        }
        await approve({
            params: approveOptions,
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log("error: ", error)
            },
        })
    }

    const handleApproveSuccess = async (tx, nftAddress, tokenId, price) => {
        await tx.wait(6)
        // 格式化 price
        price = ethers.utils.parseEther(price)
        // List
        const listOptions = {
            abi: NftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress,
                tokenId,
                price,
            },
        }
        await listItem({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => {
                console.log("error: ", error)
            },
        })
    }

    const handleListSuccess = async (tx) => {
        await tx.wait(6)
        dispatch({
            type: "success",
            icon: "bell",
            title: "上架成功",
            message: "NFT 上架成功",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                title="出售您的 NFT"
                id="mainForm"
                buttonConfig={{ theme: "primary", text: "提交", size: "large" }}
                data={formFields}
                onSubmit={approveAndList}
            ></Form>
            <Proceeds />
        </div>
    )
}
