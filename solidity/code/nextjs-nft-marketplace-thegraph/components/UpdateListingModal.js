/*
 * @Descripttion: NFT 所有者更新价格弹框
 * @Author: lizhengxing
 * @Date: 2022-11-10 21:21:51
 * @LastEditTime: 2022-11-11 09:34:06
 */
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Typography, Input, useNotification } from "web3uikit"
import { ethers } from "ethers"
import NftMarketplaceAbi from "../constants/NftMarketplace.json"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    setVisible,
    marketplaceAddress,
}) {
    // 通知
    const dispatch = useNotification()
    // 新的价格
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    // 链上合约更新价格函数
    const {
        runContractFunction: updateListing,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress,
            tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    // 弹框取消事件
    const handleCancelClick = () => {
        setVisible(false)
        setPriceToUpdateListingWith(0)
    }

    // 弹框确定事件 - NFT 价格更新成功
    const handleUpdateListingSuccess = async (tx) => {
        console.log("tx: ", tx)
        // 等待交易完成
        await tx.wait(6)
        // 派发通知
        dispatch({
            type: "success",
            title: "更新价格",
            message: "更新价格成功！请刷新",
            position: "topR",
            icon: "bell",
        })
        // 关闭弹框
        handleCancelClick()
    }

    return (
        <div>
            <Modal
                isVisible={isVisible}
                cancelText="取消"
                okText="确定"
                isCancelDisabled={isLoading || isFetching}
                isOkDisabled={isLoading || isFetching}
                id="regular"
                onCancel={handleCancelClick}
                onCloseButtonPressed={handleCancelClick}
                onOk={() => {
                    updateListing({
                        onError: (error) => {
                            console.log("error: ", error)
                            dispatch({
                                type: "error",
                                title: "更新价格",
                                message: "更新价格失败！",
                                position: "topR",
                                icon: "bell",
                            })
                        },
                        onSuccess: handleUpdateListingSuccess,
                    })
                }}
                title={
                    <div style={{ display: "flex", gap: 10 }}>
                        <Typography color="#68738D" variant="h3">
                            更新 NFT 价格
                        </Typography>
                    </div>
                }
            >
                <div className="py-5">
                    <Input
                        label="更新价格（ETH）"
                        type="number"
                        width="100%"
                        onChange={(event) => {
                            setPriceToUpdateListingWith(event.target.value)
                        }}
                    />
                </div>
            </Modal>
        </div>
    )
}
