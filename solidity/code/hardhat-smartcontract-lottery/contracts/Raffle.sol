// 买彩票
// 随机选择一个人中奖 - vrf
// 每隔一段时间，自动选择一个人中奖 - keeper

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/* Import */
// vrf 需要的文件
// VRF用户合约 - 需要继承
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// 协作合约 - 我们自己的合约需要调用协作合约里的请求随机数函数
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// keeper需要的合约
// VRF用户合约 - 需要继承
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

/* Errors */
// 加入抽奖的钱不够
error Raffle__NotEnoughETHEntered();
// 给赢家转账失败
error Raffle__TransferFailed();
// 抽奖状态不是open
error Raffle__NotOpen();
// keeper检查条件不为真
error Raffle__UpKeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffleState,
    uint256 actualInterval
);

/**
 * @title 抽奖合约
 * @author Li Zhengxing
 * @notice 这个合约用于创建一个区中心化的智能合约
 * @dev 使用了 chainlink VRF & Keeper
 */
contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* 类型声明 */
    enum RaffleState {
        OPEN, // 打开 - 0
        CALCULATEING // 计算中 - 1
    }

    /* 状态变量 */
    // 入场费
    uint256 private immutable i_entranceFee;
    // 玩家 -- 可支付地址，玩家获胜需要支付ETH
    address payable[] private s_players;
    // vrf协作合约
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    // 请求随机数参数 - ketHash
    bytes32 private immutable i_gasLane;
    // 请求随机数参数 - 订阅id
    uint64 private immutable i_subscriptionId;
    // 请求随机数参数 - 接收随机数的 gas limit
    uint32 private immutable i_callbackGasLimit;
    // 请求随机数参数 - 请求确认区块数量
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    // 请求随机数参数 - 需要获取的随机数个数
    uint32 private constant NUM_WORDS = 1;
    // 最近赢家
    address payable private s_recentWinner;
    // 抽奖状态
    RaffleState private s_raffleState;
    // 抽奖开始时间
    uint256 private s_lastTimeStamp;
    // 开奖间隔
    uint256 private immutable i_interval;

    /* Events */
    // 加入抽奖
    event RaffleEnter(address indexed player);
    // 请求了一个随机数，抽奖赢家诞生
    event RequestedRaffleWinner(uint256 indexed requestId);
    // 历届的获胜者
    event WinnerPicked(address indexed winner);

    /* Funcions */
    // 部署合约时设定入场费，并且传递vrfCoordinator合约地址
    constructor(
        address vrfCoordinator,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN; // 相当于 RaffleState(0)
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    // 加入抽奖 -- 公开的，可支付的
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }
        // 添加玩家 -- 将地址转换为 address payable
        s_players.push(payable(msg.sender));
        // 触发事件
        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev keeper用户合约中需要重写的函数，用来表示自动化执行的条件
     * 判断条件为：
     * 1、超过定的固定时间段
     * 2、至少有一名玩家，并且有 ETH
     * 3、订阅里面应该有足够的 LINK
     * 4、抽奖的状态应该是“Open”
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool isOpen = (s_raffleState == RaffleState.OPEN);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (timePassed && isOpen && hasPlayers && hasBalance);
    }

    /**
     * @dev keeper用户合约中需要重写的函数，upkeepNeeded为真时，会执行以下逻辑
     * 选择随机获胜者 -- chainlink vrf
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        // 条件判断
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState),
                (block.timestamp - s_lastTimeStamp)
            );
        }
        // 改变状态
        s_raffleState = RaffleState.CALCULATEING;
        // 请求随机数
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    // 获取请求回来的随机数
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // 利用取余来确定赢家的index
        // 数字与2取余，得到的值kennel为0，1
        // 数字与3取余，得到的值kennel为0，1，2
        // 数字与4取余，得到的值kennel为0，1，2，3
        // ...
        // 所以，我们可以使用得到的随机数与玩家数组的长度进行取余
        // 得到一个值，这个值就是数组的下标，就可以选出获胜的玩家
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        // 最近的获胜者
        s_recentWinner = s_players[indexOfWinner];
        // 改变状态
        s_raffleState = RaffleState.OPEN;
        // 改变时间
        s_lastTimeStamp = block.timestamp;
        // 重置玩家数组
        s_players = new address payable[](0);
        // 给最近的获胜者发送ETH
        (bool success, ) = s_recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(s_recentWinner);
    }

    /* view / pure Functions */
    // 获取入场费
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    // 获取某个玩家
    function getPlayer(uint256 index) public view returns (address payable) {
        return s_players[index];
    }

    // 获取玩家数量
    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    // 获取最近赢家
    function getPlayer() public view returns (address payable) {
        return s_recentWinner;
    }

    // 获取抽奖状态
    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    // 获取最近开奖时间
    function getLatestTimestamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    // 获取抽奖状态 -- 常量使用pure
    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    // 获取确认区块 -- 常量使用pure
    function getRequestConfirmations() public pure returns (uint16) {
        return REQUEST_CONFIRMATIONS;
    }
}
