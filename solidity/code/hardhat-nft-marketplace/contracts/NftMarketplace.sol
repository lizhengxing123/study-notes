// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// 上架的 NFT 价格必须大于 0
error NftMarketplace__PriceMustBeAboveZero();
// 当前 NFT 没有给市场合约批准
error NftMarketplace__NotApprovedForMarketplace();
// NFT 已经上架了
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
// NFT 还没有上架
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
// 不是当前 NFT 的所有者
error NftMarketplace__NotOwner();
// 购买 NFT 的金额不足
error NftMarketplace__NotPayEnough(
    address nftAddress,
    uint256 tokenId,
    uint256 nftPrice,
    uint256 actualPrice
);
// 没有收益
error NftMarketplace__NoProceeds();
// 提取收益失败
error NftMarketplace__TransferFailed();

/**
 * @title NFT 交易市场
 * @author Zhengxing Li
 * @notice 提供 NFT 的上架、下架、购买、更新和提取收益功能
 * @dev 需要防止重入攻击
 */
contract NftMarketplace {
    // NFT 出售对象
    struct Listing {
        uint256 price; // 价格
        address seller; // 卖家
    }

    // NFT 合约地址 -> NFT TokenId -> NFT 出售对象
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    // 卖家 -> 已卖出的金额（收益）
    mapping(address => uint256) private s_proceeds;

    // 列表项增加
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    // 购买 NFT
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 nftPrice,
        uint256 transactionPrice
    );
    // 下架 NFT
    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    // NFT 没有添加到市场
    modifier notListed(address nftAddress, uint256 tokenId) {
        // NFT 对象
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            // NFT 已经上架了
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    // NFT 已经添加到市场
    modifier isListed(address nftAddress, uint256 tokenId) {
        // NFT 对象
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            // NFT 还没有上架
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    // 是当前 NFT 的所有者
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address seller
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != seller) {
            // 不是当前 NFT 的所有者
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    /**
     * @notice 这个方法用于将你的 NFT 上架到市场
     * @dev 上架，只能外部调用
     * @dev 使用了 getApproved 方法，授予当前合约去出售卖家的 NFT
     * @param nftAddress NFT 合约地址
     * @param tokenId NFT tokenId
     * @param price NFT 价格
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external notListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
        if (price <= 0) {
            // 上架的 NFT 价格必须大于 0
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        // NFT 的所有者可以给市场（当前合约）批准，去出售他们的 NFT
        // 需要调用 IERC721 里面的 getApproved
        IERC721 nft = IERC721(nftAddress);
        // 判断是否已经批准当前合约
        if (nft.getApproved(tokenId) != address(this)) {
            // 当前 NFT 没有给市场合约批准
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        // 保存数据
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        // 触发事件
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /**
     * @notice 这个方法用于购买市场上的 NFT
     * @dev 外部调用，并且需要支付
     * @dev 需要防止重入攻击
     * @dev 方法一：检查-生效-交互（Checks-Effects-Interactions）模式
     * @dev 方法二：互斥锁 => openzeppelin
     * @param nftAddress NFT 合约地址
     * @param tokenId NFT tokenId
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        /** nonReentrant 互斥锁修饰符 */
        isListed(nftAddress, tokenId)
    {
        // NFT 对象
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > msg.value) {
            // 购买 NFT 的金额不足
            revert NftMarketplace__NotPayEnough(nftAddress, tokenId, listing.price, msg.value);
        }
        // 更新卖家的收益
        s_proceeds[listing.seller] += msg.value;
        // 删除列表里的这个NFT -- 检查-生效-交互模式
        delete (s_listings[nftAddress][tokenId]);
        // 转移 NFT - 可能会有重入攻击
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);
        // 触发事件
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price, msg.value);
    }

    /**
     * @notice 这个方法用于下架你的 NFT
     * @param nftAddress NFT 合约地址
     * @param tokenId NFT tokenId
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        // 删除列表里的这个NFT
        delete (s_listings[nftAddress][tokenId]);
        // 触发事件
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice 这个方法用于更新你的 NFT 的价格
     * @param nftAddress NFT 合约地址
     * @param tokenId NFT tokenId
     * @param newPrice 新的价格
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
        s_listings[nftAddress][tokenId].price = newPrice;
        // 触发事件 -- 重新列出来就可以
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    /**
     * @notice 这个方法用于卖家提取收益
     * @dev 防止重入攻击
     * @dev 方法一：检查-生效-交互（Checks-Effects-Interactions）模式
     * @dev 方法二：互斥锁 => openzeppelin
     */
    function withdrawProceeds() external {
        // 收益
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            // 没有收益
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            // 提取失败
            revert NftMarketplace__TransferFailed();
        }
    }

    /**
     * @notice 这个方法用于获取市场上的 NFT
     * @param nftAddress NFT 合约地址
     * @param tokenId NFT tokenId
     */
    function getListing(address nftAddress, uint256 tokenId) public view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    /**
     * @notice 这个方法用于获取卖家的收益
     */
    function getProceeds(address seller) public view returns (uint256) {
        return s_proceeds[seller];
    }
}
