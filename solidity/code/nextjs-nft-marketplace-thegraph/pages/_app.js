/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-09 20:00:12
 * @LastEditTime: 2022-11-10 19:15:08
 */
import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NotificationProvider } from "web3uikit"
import Header from "../components/Header"
import "../styles/globals.css"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/37889/nft-marketplace/v0.0.1",
})

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp
