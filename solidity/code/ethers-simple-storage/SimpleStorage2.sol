// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract SimpleStorage {
  event ValueChanged(address indexed author, string newValue, string oldValue);

  string _value;

  constructor(string memory value) {
    emit ValueChanged(msg.sender, _value, value);
    _value = value;
  }

  function getValue() public view returns (string memory) {
    return _value;
  }

  function setValue(string memory value) public {
    emit ValueChanged(msg.sender, _value, value);
    _value = value;
  }
}
