/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-05 13:21:45
 * @LastEditTime: 2022-11-05 18:28:17
 */
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
