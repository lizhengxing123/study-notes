/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-05 15:12:42
 * @LastEditTime: 2022-11-05 20:01:28
 */
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification, Button } from "web3uikit"
import { contractAddress, abi } from "../constants"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    // 入场费
    const [entranceFee, setEntranceFee] = useState("0")

    // 参与抽奖人数
    const [numPlayers, setNumPlayers] = useState("0")

    // 最近中奖的人
    const [recentWinner, setRecentWinner] = useState("0")

    // chainId - 十六进制需要转换
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex, 16)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    // 派发通知
    const dispatch = useNotification()

    // 加入抽奖函数 - enterRaffle
    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    // 获取参与抽奖的人数函数 - getNumberOfPlayers
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    // 获取最近中奖的人数函数 - getRecentWinner
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    // 获取入场费函数 - getEntranceFee
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    // 更新UI
    const updateUI = async () => {
        if (isWeb3Enabled) {
            const entranceFeeFromCall = await getEntranceFee()
            const numPlayerFromCall = await getNumberOfPlayers()
            const recentWinnerFromCall = await getRecentWinner()
            setEntranceFee(entranceFeeFromCall.toString())
            setNumPlayers(numPlayerFromCall.toString())
            setRecentWinner(recentWinnerFromCall.toString())
        }
    }

    // 连接到钱包的时候，获取入场费
    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])

    // 加入抽奖成功
    const handleSuccess = async (tx) => {
        // 等待交易通过
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    // 派发新通知
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "交易完成",
            title: "交易通知",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            抽奖入口
            {raffleAddress ? (
                <>
                    <Button
                        onClick={async () => {
                            await enterRaffle({
                                // onComplete:
                                onSuccess: handleSuccess,
                                onError: (err) => console.log(err),
                            })
                        }}
                        text="点击参加抽奖"
                        theme="primary"
                        isLoading={isLoading || isFetching}
                        loadingText="请求中..."
                        size="large"
                    />
                    <div>入场费：{ethers.utils.formatEther(entranceFee)} ETH</div>
                    <div>参与抽奖人数：{numPlayers}</div>
                    <div>最近获奖者：{recentWinner}</div>
                </>
            ) : (
                <div>没有合同地址</div>
            )}
        </div>
    )
}
