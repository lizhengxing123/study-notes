// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title 时间锁，当提案通过后，不会立即生效，给予用户离开的时间
/// @author Li Zhengxing
contract TimeLock is TimelockController {
    /// @param minDelay 提案执行之前需要等待的时间
    /// @param proposers 可以提议提案的提议者列表
    /// @param executors 提案通过后可以执行提案的执行者列表
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {}
}
