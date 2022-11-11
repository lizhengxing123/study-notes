/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-10 12:31:36
 * @LastEditTime: 2022-11-10 15:14:50
 */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ItemListed as ItemListedEvent,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ActiveItem,
  ItemBought,
  ItemListed,
  ItemCanceled,
} from "../generated/schema";

// 上架和更新都会调用
export function handleItemListed(event: ItemListedEvent): void {
  // 在 graph 中保存 ItemListedEvent 事件
  // 更新 active items
  // 获取或生成一个 item listed 对象
  // 每个 item 都需要一个 id
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    );
  }
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  // buyer 赋值为空值 -- 在市场上
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  // ItemBoughtEvent：原始事件
  // ItemBoughtObject：要保存的对象
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  // 购买的时候 ActiveItem 肯定是存在的
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    );
  }
  // 给对象赋值
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.nftPrice = event.params.nftPrice;
  itemBought.transactionPrice = event.params.transactionPrice;
  // 更新 buyer -- 已经被购买
  activeItem!.buyer = event.params.buyer;
  // 保存
  itemBought.save();
  activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
  );
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    );
  }
  // 给对象赋值
  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  // 更新 buyer 为死地址 -- 已经被下架
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );
  // 保存
  itemCanceled.save();
  activeItem!.save();
}

// 生成 ID
function getIdFromEventParams(nftAddress: Address, tokenId: BigInt): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
