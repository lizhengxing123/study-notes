## HardHat网络

#### 本地网络

启动本地节点

```
npx hardhat node
```

在本地节点运行测试或脚本
```
npx hardhat test --network localhost 
npx hardhat run scripts/deploy.js --network localhost 
```

#### console.log

可以在`solidity`文件中使用`console.log()`来打印日志信息和合约变量

- **`call`调用和交易中都可以使用，在`view`函数中工作，但在`pure`函数中不起作用**

- 最多支持4个参数，支持以下类型

  - `uint`
  - `string`
  - `address`
  - `bool`

- 还有额外的方法，只支持一个参数:

  - `console.logInt(int i)`
  - `console.logUint(uint u)`
  - `console.logAddress(address a)`
  - `console.logString(string s)`
  - `console.logBytes(bytes memory b)`
  - `console.logBytes1(bytes1 b)`
  - `...`
  - `console.logBytes32(bytes32 n)`

- `console.log("param 1: %s, param 2: %s", "one", "two")`
- `console.log`在本地网络中能检测并输出，在其他网络中不起作用

#### 分叉主网

- 用命令启动本地节点来分叉主网，地址从`alchemy`获取

```
npx hardhat node --fork 地址 
```

- 在`hardhat.config.js`中配置，任何在`hardhat`网络中执行的任务，都将在分叉的节点上进行

```js
// hardhat.config.js
{
    ...
    networks: {
        hardhat: {
            forking: {
                // 地址从`alchemy`获取
                url: "",
                // 从固定的块进行分叉
                blockNumber: 14390000
            }
        }
    }
}
```

#### 挖矿模式

- 自动挖矿：发送的每笔交易都会包含在一个新的区块中（默认）

```js
// hardhat.config.js
{
    ...
    networks: {
        hardhat: {
            mining: {
                auto: true,
                interval: 0
            }
        }
    }
}
```

- 间隔挖矿：定期挖一个区块，其中包括尽可能多的待处理交易

```js
// hardhat.config.js
{
    ...
    networks: {
        hardhat: {
            mining: {
                auto: false,
                // 每 5 秒产生一个新的区块
                // interval: 5000
                // 随机延迟后生成一个新的区块
                interval: [5000, 10000]
            }
        }
    }
}
```

- 手动挖矿：`hardhat`网络不会产生新的区块，使用`evm_mine`手动开采新的区块，区块中包含尽可能多的待处理交易

```js
// hardhat.config.js
{
    ...
    networks: {
        hardhat: {
            mining: {
                auto: false,
                interval: 0
            }
        }
    }
}
```

- `Mempool`行为：当自动挖矿被禁用后，每一个发送的交易都被添加到`Mempool`（内存池）中，其中包含了所有未来可以被开采的交易，遵循以下规则：


    
  - `Gas`价格高的交易排在前面
  - `Gas`价格相同时，先收到的交易先执行
  - 如果交易无效，则交易被取消

- 获取下一个区块中待处理的交易列表

```js
const pendingBlocks = await network.provider.send("eth_getBlockByNumber", ["pending", false])
```

- 使用`RPC`方法配置挖矿模式

```js
// 关闭自动挖矿
await network.provider.send("evm_setAutomine", [false])
// 启用间隔挖矿
await network.provider.send("evm_setIntervalMining", [5000])
```

#### JSON_RPC 方法

- 用于测试和`Debug`的方法

    - `evm_increaseTime`：增加区块时间
    - `evm_mine`：挖掘区块
    - `evm_snapshot`：区块快照，不接受参数，返回创建的快照的 ID，只能还原一次，相同的快照 id 不能再次使用
    - `evm_revert`：使用快照id还原
    - `evm_setNextBlockTimestamp`：在下一个块中采用您想要的确切时间戳，并相应地增加时间。

- 其他方法
    - `debug_traceTransaction`：获取已挖掘交易的调试跟踪
    - `hardhat_addCompilationResult`：添加有关已编译合约的信息
    - `hardhat_dropTransaction`：从内存池中删除交易
    - `hardhat_impersonateAccount`：模拟账户
    - `hardhat_stopImpersonateAccount`：停止模拟
    - `hardhat_getAutomine`：是否启用了自动挖掘，返回`true/false`
    - `hardhat_mine`：在恒定的时间内，一次挖掘任意数量的区块，接收两个参数，区块数和每个区块的时间戳间隔，默认值都是1
    - `hardhat_setBalance`：设置余额
    - `hardhat_reset`：重置fork
```js
// 获取已挖掘交易的调试跟踪
await network.provider.send("debug_traceTransaction", ["0x123..."])
// 模拟账户
await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x1222.."]
}
// 停止模拟
await network.provider.request({
    method: "hardhat_stopImpersonateAccount",
    params: ["0x1222.."]
}
// 模拟账户,另外一种方法
await ethers.provider.getSigner("0x12...")
// 挖掘256个区块
await network.provider.send("hardhat_mine", ["0x100"])
// 挖掘256个区块，间隔1分钟
await network.provider.send("hardhat_mine", ["0x100", "0x3c"])
// 设置为4096wei
await network.provider.send("hardhat_setBalance", ["0x0d2026b3EE6eC71FC6746ADb6311F6d3Ba1C000B", "0x1000"])
// 重置fork - 重置回全新的fork，从另一个区块好开始
await network.provider.request({
    method: "hardhat_reset",
    params: [{
        forking: {
        jsonRpcUrl: "",
        blockNumber: 11095000
        }
    }]
})
// 禁用 fork
await network.provider.request({
    method: "hardhat_reset",
    params: []
})
```
  