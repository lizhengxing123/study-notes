// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;
    string private constant BASE64_ENCODED_SVG_PREFIX = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256) public s_tokenIdToHighValue;

    event CreatedNFT(uint256 indexed tokenId, int256 haighValue);

    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory haighSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        s_lowImageURI = svgToImageURI(lowSvg);
        s_highImageURI = svgToImageURI(haighSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function mintNft(int256 highValue) public {
        s_tokenIdToHighValue[s_tokenCounter] = highValue;
        _safeMint(msg.sender, s_tokenCounter);
        emit CreatedNFT(s_tokenCounter, highValue);
        s_tokenCounter++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "DynamicSvgNft: URI set of nonexistent token");
        string memory imageURI = s_lowImageURI;
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageURI = s_highImageURI;
        }
        return
            // bytes -> string
            string(
                // json格式base64 - 类型为bytes
                abi.encodePacked(
                    // base64前缀 - json格式
                    _baseURI(),
                    // 转成base64 - json格式
                    Base64.encode(
                        // 组装json - 返回值为bytes
                        abi.encodePacked(
                            '{"name":"',
                            name(),
                            '","description":"An NFT that changes based on the chainlink Feed.",',
                            '"attributes":[{"trait_type":"coolness","value":100}],"image":"',
                            imageURI,
                            '"}'
                        )
                    )
                )
            );
    }

    function svgToImageURI(string memory svg) public pure returns (string memory) {
        // svg -> base64
        string memory svgBase64Encoded = Base64.encode(abi.encodePacked(svg));
        // 添加 base64 svg 前缀
        return string(abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, svgBase64Encoded));
    }
}
