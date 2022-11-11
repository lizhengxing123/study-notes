/*
 * @Descripttion: 头部
 * @Author: lizhengxing
 * @Date: 2022-11-09 20:13:48
 * @LastEditTime: 2022-11-11 09:33:13
 */
import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <div className="flex items-center justify-between py-8 border-b-2">
            <div className="flex items-center">
                <div className="font-bold text-4xl mx-10 mr-20">NFT Marketplace</div>
                <div className="flex items-center">
                    <Link href="/">
                        <a className="ml-20 mr-16 text-xl">Home</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="text-xl">Sell NFTs</a>
                    </Link>
                </div>
            </div>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
