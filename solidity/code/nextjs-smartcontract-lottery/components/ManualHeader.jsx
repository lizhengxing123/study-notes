/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-05 13:42:45
 * @LastEditTime: 2022-11-05 18:09:47
 */
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    // 只执行一次
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("account: ", account)
            if (!account) {
                // 断开连接
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])

    return (
        <div>
            {isWeb3Enabled && account ? (
                <div>
                    连接到账户：{account.slice(0, 6)}...{account.slice(-4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    连接
                </button>
            )}
        </div>
    )
}
