// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__MintFeeNotEnough();
error RandomIpfsNft__WithdrawFailed();

/**
 * @title 生成随机的 NFT，存储在IPFS
 * @dev 请求chainlink获取随机数，使用这个随机数，获取一个随机的NFT
 */
contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    // 狗的品种
    enum Breed {
        PUG, // 0-10
        SHIBA_INU, // 10-40
        ST_BERNARD // 40-max
    }
    // chainlink vrf 变量
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint32 private immutable i_callbackGasLimit;
    uint64 private immutable i_subId;
    bytes32 private immutable i_keyHash;

    // vrf 相关变量 requestId => msg.sender
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT 变量
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dogTokenUris;
    uint256 internal immutable i_mintFee;

    // events
    event NftRequested(uint256 requestId, address requester);
    event NftMinted(Breed dogBreed, address minter);

    constructor(
        address VRFCoordinatorV2Address,
        uint32 callbackGasLimit,
        uint64 subId,
        bytes32 keyHash,
        string[3] memory dogTokenUris,
        uint256 mintFee
    ) VRFConsumerBaseV2(VRFCoordinatorV2Address) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2Address);
        i_callbackGasLimit = callbackGasLimit;
        i_subId = subId;
        i_keyHash = keyHash;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
    }

    /**
     * @dev 获取NFT时，发送随机数请求
     */
    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__MintFeeNotEnough();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    /**
     * @dev 获取随机数
     * @dev 用户需要去支付一定的ETH以获取一个NFT
     * @dev 合约的部署者可以提取合约里的余额
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        s_tokenCounter++;
        // 铸币
        _safeMint(dogOwner, newTokenId);
        // 设置
        _setTokenURI(newTokenId, s_dogTokenUris[uint256(dogBreed)]);
        emit NftMinted(dogBreed, dogOwner);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__WithdrawFailed();
        }
    }

    /**
     * @dev 根据随机数获取狗的品种
     */
    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        // 累加总和
        uint256 cumulateSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; ++i) {
            if (moddedRng >= cumulateSum && moddedRng < cumulateSum + chanceArray[i]) {
                return Breed(i);
            }
            cumulateSum += chanceArray[i];
        }
        // 随机数取值不在范围内 - 恢复交易
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getTokenUri(uint256 index) public view returns (string memory) {
        return s_dogTokenUris[index];
    }
}
