/*
 * @Descripttion: 收益
 * @Author: lizhengxing
 * @Date: 2022-11-11 15:38:42
 * @LastEditTime: 2022-11-11 16:23:24
 */
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { Button, useNotification } from "web3uikit"
import { ethers } from "ethers"
import NftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
export default function Proceeds() {
    const dispatch = useNotification()
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const [proceeds, setProceeds] = useState(0)
    // 获取收益
    const { runContractFunction: getProceeds } = useWeb3Contract()
    // 提取收益
    const {
        runContractFunction: withdrawProceeds,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdrawProceeds",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            setupUI()
        }
    }, [isWeb3Enabled, account, chainId])
    // 获取收益
    const setupUI = async () => {
        const returnProceeds = await getProceeds({
            params: {
                abi: NftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => {
                console.log("error: ", error)
            },
        })
        if (returnProceeds) {
            setProceeds(ethers.utils.formatEther(returnProceeds))
        }
    }
    // 提取收益
    const handleWithdrawProceedsSuccess = async (tx) => {
        await tx.wait(6)
        dispatch({
            type: "success",
            icon: "bell",
            title: "提取收益",
            message: "提取收益成功",
            position: "topR",
        })
    }
    return (
        <div>
            {isWeb3Enabled ? (
                <>
                    <div>您的收益为：{proceeds} ETH</div>{" "}
                    <div>
                        <Button
                            text="提取收益"
                            theme="primary"
                            size="large"
                            disabled={proceeds <= 0}
                            isLoading={isFetching || isLoading}
                            loadingText="提取中..."
                            onClick={() => {
                                withdrawProceeds({
                                    onSuccess: handleWithdrawProceedsSuccess,
                                    onError: (error) => {
                                        console.log("error: ", error)
                                    },
                                })
                            }}
                        ></Button>
                    </div>
                </>
            ) : (
                <div>Web3 未连接</div>
            )}
        </div>
    )
}
