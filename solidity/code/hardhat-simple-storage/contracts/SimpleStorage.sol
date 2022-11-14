// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SimpleStorage {
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) public nameToFavoriteNumber;

    uint256 favoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        console.log("favoriteNumber", favoriteNumber);
        console.log(12, true, "asd", msg.sender);
        console.logInt(334);
        console.logBool(false);
        console.logAddress(msg.sender);
        console.logBytes1(0x12);
        console.log("param 1: %s, param 2: %s", "one", "two");
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(uint256 _favoriteNumber, string memory _name) public {
        people.push(People({favoriteNumber: _favoriteNumber, name: _name}));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
