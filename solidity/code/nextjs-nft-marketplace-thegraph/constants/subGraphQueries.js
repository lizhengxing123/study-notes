/*
 * @Descripttion: 子图查询语句
 * @Author: lizhengxing
 * @Date: 2022-11-10 19:20:37
 * @LastEditTime: 2022-11-10 19:22:14
 */
import { gql } from "@apollo/client"

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

export default GET_ACTIVE_ITEMS
