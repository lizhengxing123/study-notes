import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2 flex justify-between p-5 items-center">
            <p className="px-4 py-4 font-bold text-3xl">去中心化抽奖</p>
            <div className="mr-2">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
