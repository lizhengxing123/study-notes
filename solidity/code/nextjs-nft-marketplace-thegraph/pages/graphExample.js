/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-10 18:02:33
 * @LastEditTime: 2022-11-10 19:15:39
 */
import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export default function GraphExample() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
    console.log("data: ", data)
    return (
        <>
            {/* {data.map((i) => (
                <div>{i.buyer}</div>
            ))} */}
            <div>Hi</div>
        </>
    )
}
