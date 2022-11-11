/*
 * @Descripttion: 首页 - 展示最近上架的 NFT，在 NFTBox 组件中提供一些操作
 * @Author: lizhengxing
 * @Date: 2022-11-05 13:21:45
 * @LastEditTime: 2022-11-11 09:34:50
 */
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subGraphQueries"
import NFTBox from "../components/NFTBox"
import styles from "../styles/Home.module.css"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className={styles.container}>
            <div className="p-4 font-bold text-2xl">最近上架</div>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>加载中...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { id, nftAddress, tokenId, seller, price } = nft
                            return (
                                <NFTBox
                                    key={id}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    seller={seller}
                                    price={price}
                                    marketplaceAddress={marketplaceAddress}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 当前未启用</div>
                )}
            </div>
        </div>
    )
}
