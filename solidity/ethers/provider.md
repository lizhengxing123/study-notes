<!--
 * @Descripttion: 
 * @Author: lizhengxing
 * @Date: 2022-10-25 19:28:52
 * @LastEditTime: 2022-10-26 20:03:15
-->

## Provider

`Provider`是一个连接以太坊网络的抽象，用于查询以太坊网络状态或者发送更改状态的交易

`EtherscanProvider`和`InfuraProvider`提供连接公开的第三方节点服务提供商，无需自己运行任何以太坊节点

`JsonRpcProvider`和`IpcProvider`允许连接到我们控制或者可以访问的以太坊节点（包括主网、测试网、权威证明节点和Ganache）

```js
// 连接默认的provider
// 可以使用任何标准网络名称做参数
const defaultProvider = ethers.getDefaultProvider('goerli');

// 连接 MetaMask
const metaMaskProvider = new ethers.providers.Web3Provider(web3.currentProvider)
```

#### 连接以太坊网络

- `ethers.getDefaultProvider([network = 'homestead'])`
创建一个由多个后端（`INFURA`和`Etherscan`）支持的`FallbackProvider`。**如果不是运行自己的以太坊节点，这是推荐的连接方法**

- `new ethers.providers.EtherscanProvider([network = 'homestead'][, apiToken])`
连接`Etherscan` `blockchain` `web服务API`

- `new ethers.providers.InfuraProvider([network = 'homestead'][, apiAccessToken])`
连接`INFURA`提供的以太坊节点

- `new ethers.providers.JsonRpcProvider([urlOrInfo = 'HTTP://127.0.0.1:7545'][, network])`
通过节点`urlOrInfo`的`JSON-RPC API URL` 进行连接。
`urlOrInfo`可以为一个对象，参数如下：
    - `url` - `JSON-RPC API URL` 必须
    - `user` - 用于基本身份验证的用户名 可选
    - `password` - 用于基本身份验证的密码 可选
    - `allowInsecure` - 允许通过不安全的`HTTP`网络进行基本身份验证，默认`false`

- `new ethers.providers.Web3Provider(web3Provider[, network])`
连接到现有的`web3`提供者，如`web3Instance.currentProvider`。如果没指定参数`network`，也会自动检测网络`network`（主网还是测试网）

- `new ethers.providers.FallbackProvider(providers)`
通过依次尝试每个`Provider`来提高可靠性，如果遇到错误，则返回列表中的下一个提供程序。网络由`Provider`确定，必须相互匹配

- `new ethers.providers.IpcProvider(path[, network])`
通过节点`IPC``JSON-RPC API` 连接节点，提供一个`IPC`路径`path`。如果没指定参数`network`，也会自动检测网络`network`（主网还是测试网）

```js
// 连接第三方提供者
// 可以使用任何标准网络名称做参数：
//  - "homestead"
//  - "rinkeby"
//  - "ropsten"
//  - "kovan"
//  - "goerli"
const etherscanProvider = new ethers.providers.EtherscanProvider("goerli")
const infuraProvider = new ethers.providers.InfuraProvider("goerli")

// 连接到本地的以太坊节点
// 默认 http://localhost:8545
const jsonRpcProvider = new ethers.providers.JsonPrcProvider()
// 本地Ganache
const ganacheProvider = new ethers.providers.JsonPrcProvider("HTTP://127.0.0.1:7545")
// IPC命名通道
const ipcProvider = new ethers.providers.IpcProvider("/var/run/parity.ipc")

// 连接一个已有的web3提供者
const currentProvider = new web3.providers.HttpProvider("http://localhost:8545")
const web3Provider = new ethers.providers.Web3Provider(currentProvider)
```

#### 属性

##### 基类 Provider 属性

- `prototype.blockNumber`
返回`provider`已经知晓的最新区块高，如果没有同步到区块，则为null

- `prototype.polling`
可变的，如果`provider`正在轮询，则为它活跃的观察事件。轮询可以设置为临时启用/禁用或永久禁用以允许节点进程退出

- `prototype.pollingInterval`
可变的，`provider`的轮询频率，单位为毫秒。默认事件间隔为4秒。对于本地节点，更小的轮询间隔也许有意义，不过轮询`Etherscan``INFURA`时，设置的太低可能会导致服务阻止我们的`IP`地址或者以其他方式限制`API`调用

##### EtherscanProvider（派生于 Provider）属性

- `prototype.apiToken`
`The Etherscan API Token` 没有则为空

##### InfuraProvider（派生于 JsonRpcProvider）属性

- `prototype.apiAccessToken`
`The INFURA API Access Token` 没有则为空

##### JsonRpcProvider（派生于 Provider）属性

- `prototype.connection`
描述`JSON-RPC`节点与属性的连接对象，有以下属性：
    - `url` - `JSON-RPC API URL`
    - `user` - 用于基本身份验证的用户名
    - `password` - 用于基本身份验证的密码
    - `allowInsecure` - 允许通过不安全的`HTTP`网络进行基本身份验证

##### Web3Provider（派生于 JsonRpcProvider）属性

- `prototype.provider`
与`web3`库兼容的底层`Provider`，比如`HTTPProvider``IPCProvider`。`Web3Provider`唯一需要的方法是:
    - `sendAsync(method, params, callback)`

##### FallbackProvider（派生于 Provider）属性

- `prototype.providers`
一组`provider`的拷贝，修改此变量不会影响关联的`provider`

##### IpcProvider（派生于 JsonRpcProvider）属性

- `prototype.path`
返回连接的命名管道路径

```js
const provider = new ethers.providers.JsonRpcProvider(
"HTTP://127.0.0.1:7545"
);
console.log("blockNumber: ", provider.blockNumber); // -1
console.log("polling: ", provider.polling); // false
console.log("pollingInterval: ", provider.pollingInterval); // 4000
console.log("connection: ", provider.connection); // { url: 'HTTP://127.0.0.1:7545' }
```

#### 获取网络

- `prototype.getNetwork() => Promise<Network>`
返回可获取网络对象的`Promise`，包括连接的网络和链信息

```js
const defaultProvider = new ethers.providers.EtherscanProvider("goerli");
const network = await defaultProvider.getNetwork();
console.log("network: ", network);
// {
//   name: 'goerli',
//   chainId: 5,
//   ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
//   _defaultProvider: [Function: func] { renetwork: [Function (anonymous)] }
// }
```

#### 获取账号信息

- `prototype.getBalance(addressOrName[, blockTag = "latest"]) => Promise<BigNumber>`
返回参数`addressOrName`的余额，类型为`BigNumber`，参数`blockTag`可以制定一个区块

- `prototype.getTransactionCount(addressOrName[, blockTag = "latest"]) => Promise<number>`
返回参数`addressOrName`所发送的交易数量，类型为`Number`，它用来作为发送交易的`nonce`，参数`blockTag`可以制定一个区块

```js
const provider = new ethers.providers.JsonRpcProvider(
"HTTP://127.0.0.1:7545"
);
const balance = await provider.getBalance(
"0xd840156c87BCC544706df3BCb1e1731e72F9D464"
);
console.log("balance: ", balance);
// BigNumber { _hex: '0x056bc75e2d63100000', _isBigNumber: true }
const count = await provider.getTransactionCount(
"0xd840156c87BCC544706df3BCb1e1731e72F9D464"
);
console.log("count: ", count)
// 0
```

#### 获取以太坊的状态

- `prototype.getBlockNumber() => Promise<number>`
返回最新区块号

- `prototype.getGasPrice() => Promise<BigNumber>`
返回当前`Gas`价格

- `prototype.getBlock(blockHashOrBlockNumber) => Promise<Block>`
返回给定参数对应的区块信息

- `prototype.getTransaction(transactionHash) => Promise<TransactionResponse>`
根据交易`hash`获取交易信息

- `prototype.getTransactionReceipt(transactionHash) => Promise<TransactionReceipt>`
根据交易`hash`获取交易收据

```js
const provider = new ethers.providers.JsonRpcProvider(
"HTTP://127.0.0.1:7545"
);
console.log("getBlockNumber: ", await provider.getBlockNumber());
// 2
console.log("getGasPrice: ", ethers.utils.formatEther(await provider.getGasPrice()));
// 0.00000002
console.log("getBlock: ", await provider.getBlock(1));
// {
//   hash: '0x32053b5d2cc2a43d671269609cb7cdf48afeea1cf56453bddbe164ee2109e3b0',
//   parentHash: '0x94e1963aa430be43659717a69493aed817699bb9dfdf81cbe5c22d09634c193f',
//   number: 1,
//   timestamp: 1666702880,
//   nonce: '0x0000000000000000',
//   difficulty: 0,
//   gasLimit: BigNumber { _hex: '0x6691b7', _isBigNumber: true },
//   gasUsed: BigNumber { _hex: '0x07140e', _isBigNumber: true },
//   miner: '0x0000000000000000000000000000000000000000',
//   extraData: '0x',
//   transactions: [
//     '0x42762a9b313b54809d6b456c124c864ab9219fbfafb1d1a2720882abf2e30a76'
//   ],
//   _difficulty: BigNumber { _hex: '0x00', _isBigNumber: true }
// }
console.log(
    "getTransaction: ",
    await provider.getTransaction(
        "0x42762a9b313b54809d6b456c124c864ab9219fbfafb1d1a2720882abf2e30a76"
)
);
// {
//   hash: '0x42762a9b313b54809d6b456c124c864ab9219fbfafb1d1a2720882abf2e30a76',
//   type: 0,
//   accessList: null,
//   blockHash: '0x32053b5d2cc2a43d671269609cb7cdf48afeea1cf56453bddbe164ee2109e3b0',
//   blockNumber: 1,
//   transactionIndex: 0,
//   confirmations: 2,
//   from: '0xd840156c87BCC544706df3BCb1e1731e72F9D464',
//   gasPrice: BigNumber { _hex: '0x04a817c800', _isBigNumber: true },
//   gasLimit: BigNumber { _hex: '0x07140e', _isBigNumber: true },
//   to: null,
//   value: BigNumber { _hex: '0x00', _isBigNumber: true },
//   nonce: 0,
//   data: '**',
//   r: '0x36203a3154a3d92fcf87621238d11345eaee219f4ba60cf2f198ecde10096b9f',
//   s: '0x44ee6d456dd40f89712fc13123b91a0e1d6c89e83567eb87e326dfe1606f25de',
//   v: 2710,
//   creates: '0x3b10F01bA814064ed4787938E189824a0d76171a',
//   chainId: 1337,
//   wait: [Function (anonymous)]
// }
console.log(
    "getTransactionReceipt: ",
    await provider.getTransactionReceipt(
        "0x42762a9b313b54809d6b456c124c864ab9219fbfafb1d1a2720882abf2e30a76"
    )
);
// {
//   to: null,
//   from: '0xd840156c87BCC544706df3BCb1e1731e72F9D464',
//   contractAddress: '0x3b10F01bA814064ed4787938E189824a0d76171a',
//   transactionIndex: 0,
//   gasUsed: BigNumber { _hex: '0x07140e', _isBigNumber: true },
//   logsBloom: '****',
//   blockHash: '0x32053b5d2cc2a43d671269609cb7cdf48afeea1cf56453bddbe164ee2109e3b0',
//   transactionHash: '0x42762a9b313b54809d6b456c124c864ab9219fbfafb1d1a2720882abf2e30a76',
//   logs: [],
//   blockNumber: 1,
//   confirmations: 2,
//   cumulativeGasUsed: BigNumber { _hex: '0x07140e', _isBigNumber: true },
//   status: 1,
//   type: 0,
//   byzantium: true
// }
```

#### 以太坊域名服务 ENS

以太坊域名服务`ENS`允许使用一个容易记住的名称来关联一个以太坊地址，类似于域名和`IP`地址。`ENS`提供反向查找功能，如果已经配置，可以通过名称找到地址

- `prototype.resolveName(ensName) => Promise<Address>`
获取`ensName`对应的地址，没有则为`null`

- `prototype.lookupAddress(address) => Promise<string>`
获取`address`对应的`ensName`，没有则为`null`

```js
// 根据名称解析地址
const address = provider.resolveName("registrar.firefly.eth")
console.log('address: ', address);
// "0x6fC21092DA55B392b045eD78F4732bff3C580e2c"

// 根据地址获取名称
const ensName = provider.lookupAddress("0x6fC21092DA55B392b045eD78F4732bff3C580e2c")
console.log('ensName: ', ensName);
// registrar.firefly.eth
```

#### 执行合约

- `prototype.call(transaction) => Promise<hex>`
发送只读交易到单个以太坊节点并返回执行结果，类型为16进制字符串。免费执行，不会改变区块链上的任何状态

- `prototype.estimateGas(transaction) => Promise<BigNumber>`
发送交易到单个以太坊节点并返回预估的`Gas`数量，类型`BigNumber`。免费执行，知识一个估算，发送太少的`Gas`将会导致交易失败，同时仍然消耗掉所有提供的`Gas`

- `prototype.sendTransaction(signedTransaction) => Promise<TransactionResponse>`
发送签名交易到单个以太坊节点并返回交易信息，类型`TransactionResponse`。免费执行，知识一个估算，发送太少的`Gas`将会导致交易失败，同时仍然消耗掉所有提供的`Gas`

#### 合约信息

- `prototype.getCode(addressOrName) => Promise<hex>`
返回`addressOrName`的16进制字节码

- `prototype.getStorageAt(addressOrName, position[, blockTag = "latest"]) => Promise<hex>`
返回`addressOrName`在`position``blockTag`位置的值

- `prototype.getLogs(filter) => Promise<Log[]>`
返回匹配筛选器的日志数组，可能为空

```js
provider.getCode()
```
#### 事件

- `prototype.on(eventType, callback) => Provider`
为事件类型注册一个回调

- `prototype.once(eventType, callback) => Provider`
为下一个（且只有下一个）事件类型注册一个回调

- `prototype.removeListener(eventType, callback) => boolean`
注销事件类型的回调，如果同一个回调被多次注册，则只删除第一个注册的实例

- `prototype.removeAllListener(eventType) => Provider`
注销事件所有的回调

- `prototype.listenerCount([eventType]) => number`
返回事件类型注册的回调数量，如果省略，则返回所有注册的回调数量

- `prototype.resetEventsBlock(blockNumber) => void`
开始扫描来自`blockNumber`的事件。默认情况下，事件从提供程序开始轮询的块号开始

##### 事件类型

- `block`
每当开采新区块时，`callback(blockNumber)`

- `error`
每当事件期间发生错误时，`callback(error)`

- `any address`
每当相应地址的余额发生变化时，`callback(balance)`

- `any transaction hash`
当相应的交易已经包含在区块中，`callback(transactionReceipt)`

- `a filtered event object`
`callback(log)`

- `an array of topics`
`callback(log)`

##### 等待交易

- `prototype.waitForTransaction(transactionHash) => Promise<TransactionReceipt>`
等待交易完成，返回交易收据

```js
provider.on('block', (blockNumber) => {
    console.log('blockNumber: ', blockNumber);
})
provider.on('0x46Fa84b9355dB0708b6A57cd6ac222950478Be1d', (balance) => {
    console.log('balance: ', balance);
})
// 交易开采
provider.once(transactionHash, (receipt) => {
    console.log('receipt: ', receipt);
})
const receipt = await provider.waitForTransaction(transactionHash)
console.log('receipt: ', receipt);
```

#### 对象及类型

##### Block Tag

- `a number or hex string` 区块的数字
- `latest`  最近开采的区块
- `pending` 正在开采的区块

##### 区块信息

```js
{
    parentHash: "0x3d8182d27303d92a2c9efd294a36dac878e1a9f7cb0964fa0f789fa96b5d0667",
    hash: "0x7f20ef60e9f91896b7ebb0962a18b8defb5e9074e62e1b6cde992648fe78794b",
    number: 3346463,

    difficulty: 183765779077962,
    timestamp: 1489440489,
    nonce: "0x17060cb000d2c714",
    extraData: "0x65746865726d696e65202d20555331",

    gasLimit: utils.bigNumberify("3993225"),
    gasUsed: utils.bigNuberify("3254236"),

    miner: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8",
    transactions: [
        "0x125d2b846de85c4c74eafb6f1b49fdb2326e22400ae223d96a8a0b26ccb2a513",
        "0x948d6e8f6f8a4d30c0bd527becbe24d15b1aba796f9a9a09a758b622145fd963",
        ... [ 49 more transaction hashes ] ...
        "0xbd141969b164ed70388f95d780864210e045e7db83e71f171ab851b2fba6b730"
    ]
}
```

##### 网络信息

```js
{
  name: 'goerli',
  chainId: 5,
  ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
```

##### 交易信息

```js
{
    // Required unless deploying a contract (in which case omit)
    to: addressOrName,  // the target address or ENS name

    // These are optional/meaningless for call and estimateGas
    nonce: 0,           // the transaction nonce
    gasLimit: 0,        // the maximum gas this transaction may spend
    gasPrice: 0,        // the price (in wei) per unit of gas

    // These are always optional (but for call, data is usually specified)
    data: "0x",         // extra data for the transaction, or input for call
    value: 0,           // the amount (in wei) this transaction is sending
    chainId: 3          // the network ID; usually added by a signer
}
```

##### 交易响应

```js
{
    // Only available for mined transactions
    blockHash: "0x7f20ef60e9f91896b7ebb0962a18b8defb5e9074e62e1b6cde992648fe78794b",
    blockNumber: 3346463,
    timestamp: 1489440489,

    // Exactly one of these will be present (send vs. deploy contract)
    // They will always be a properly formatted checksum address
    creates: null,
    to: "0xc149Be1bcDFa69a94384b46A1F91350E5f81c1AB",

    // The transaction hash
    hash: "0xf517872f3c466c2e1520e35ad943d833fdca5a6739cfea9e686c4c1b3ab1022e",

    // See above "Transaction Requests" for details
    data: "0x",
    from: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8",
    gasLimit: utils.bigNumberify("90000"),
    gasPrice: utils.bigNumberify("21488430592"),
    nonce: 0,
    value: utils.parseEther(1.0017071732629267),

    // The chain ID; 0 indicates replay-attack vulnerable
    // (eg. 1 = Homestead mainnet, 3 = Ropsten testnet)
    chainId: 1,

    // The signature of the transaction (TestRPC may fail to include these)
    r: "0x5b13ef45ce3faf69d1f40f9d15b0070cc9e2c92f3df79ad46d5b3226d7f3d1e8",
    s: "0x535236e497c59e3fba93b78e124305c7c9b20db0f8531b015066725e4bb31de6",
    v: 37,

    // The raw transaction (TestRPC may be missing this)
    raw: "0xf87083154262850500cf6e0083015f9094c149be1bcdfa69a94384b46a1f913" +
           "50e5f81c1ab880de6c75de74c236c8025a05b13ef45ce3faf69d1f40f9d15b0" +
           "070cc9e2c92f3df79ad46d5b3226d7f3d1e8a0535236e497c59e3fba93b78e1" +
           "24305c7c9b20db0f8531b015066725e4bb31de6"
}
```

##### 交易收据

```js
{
    transactionHash: "0x7dec07531aae8178e9d0b0abbd317ac3bb6e8e0fd37c2733b4e0d382ba34c5d2",

    // The block this transaction was mined into
    blockHash: "0xca1d4d9c4ac0b903a64cf3ae3be55cc31f25f81bf29933dd23c13e51c3711840",
    blockNumber: 3346629,

    // The index into this block of the transaction
    transactionIndex: 1,

    // The address of the contract (if one was created)
    contractAddress: null,

    // Gas
    cumulativeGasUsed: utils.bigNumberify("42000"),
    gasUsed: utils.bigNumberify("21000"),

    // Logs (an Array of Logs)
    log: [ ],
    logsBloom: "0x00" ... [ 256 bytes of 0 ] ... "00",

    // Post-Byzantium hard-fork
    byzantium: false

    ////////////
    // Pre-byzantium blocks will have a state root:
    root: "0x8a27e1f7d3e92ae1a01db5cce3e4718e04954a34e9b17c1942011a5f3a942bf4",

    ////////////
    // Post-byzantium blocks will have a status (0 indicated failure during execution)
    // status: 1
}
```

##### 日志

```js
{
    // The block this log was emitted by
    blockNumber:
    blockHash:

    // The transaction this log was emiited by
    transactionHash:
    transactionIndex:
    logIndex:

    // Whether the log has been removed (due to a chain re-org)
    removed: false,

    // The contract emitting the log
    address:

    // The indexed data (topics) and non-indexed data (data) for this log
    topics: []
    data:
}
```

##### 过滤器

```js
{
    // Optional; The range of blocks to limit querying (See: Block Tags above)
    fromBlock: "latest",
    toBlock: "latest",

    // Optional; The specific block to limit the query to
    // Note: This may NOT be used with fromBlock or toBlock
    // Note: EtherscanProvider does not support blockHash
    // Note: This may be used for getLogs, but not as a provider Event (i.e. .on)
    blockHash: blockHash,

    // Optional; An address (or ENS name) to filter by
    address: addressOrName,

    // Optional; A (possibly nested) list of topics
    topics: [ topic1 ]
}
```

#### Provider额外的API

##### EtherscanProvider

- `prototype.getEtherPrice()`
以美元为单位返回`ether`的价格

- `prototype.getHistory(addressOrName[, startBlock = 0][, endBlock = "latest"]) => Promise<TransactionResponse[]>`
返回开始区块和结束区块之间的交易响应数组

##### JsonRpcProvider

- `prototype.send(method, params) => Promise<any>`
发送带有参数的`JSON-RPC`方法。这对于调用非标准或不太常见的`JSON-RPC`方法非常有用。返回一个Promise，为解析后的`JSON`结果。

- `prototype.listAccounts() => Promise<Address[]>`
返回提供者的账户列表

- `prototype.getSigner([indexOrAddress]) => JsonRpcSigner `
返回账户指定位置的`JsonRpcSigner`，如果没参数返回第一个

```js
const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
);
// send
provider.send('debug_traceTransaction', [ hash ]).then((result) => {
    console.log(result);
});
const accounts = await provider.listAccounts()
// [ 
//   '0xd840156c87BCC544706df3BCb1e1731e72F9D464',
//   '0x254705330cba85661Ce38C905C24e135e2A000e6',
//   '0x345F9143757cfD730755899011308DC3d2C4DBF8',
//   '0x0F1a5c1EeEb258aF3990be4f175923affA85203b',
//   '0x029374E991Af3F127A45752C1C9509E179596525',
//   '0x97b76c27C8C2dd57FfF6F4EF0C6Bf255D77B50C2',
//   '0x6187E637026D7545B384836ab86302508AE85532',
//   '0x56591828Cf3b48Ef29c79DD622A77e0EC8384761',
//   '0x582Cc55D82f8F85Fd004073CAC026e130bC68A6A',
//   '0x513Ea7F63BCEC340AB40273f65B4f0E82D94c672' 
// ]
const signer = await provider.getSigner(accounts[0])
// {
//   _isSigner: true,
//   provider: {
//      _isProvider: true,
//      _events: [],
//      _emitted: { block: -2 },
//      disableCcipRead: false,
//      formatter: Formatter { formats: [Object] },
//      anyNetwork: false,
//      _networkPromise: Promise { <pending> },
//      _maxInternalBlockNumber: -1024,
//      _lastBlockNumber: -2,
//      _maxFilterBlockRange: 10,
//      _pollingInterval: 4000,
//      _fastQueryDate: 0,
//      connection: { url: 'HTTP://127.0.0.1:7545' },
//      _nextId: 44,
//      _eventLoopCache: { detectNetwork: null, eth_chainId: [Promise] } },
//   _address: '0xd840156c87BCC544706df3BCb1e1731e72F9D464',
//   _index: null 
// }
```

##### JsonRpcSigner

- `prototype.provider`
连接的`provider`

- `prototype.getAddress() => Promise<Address>`
获取账号地址

- `prototype.getBalance([BlockTag = "latest"]) => Promise<BigNumber>`
获取账号余额

- `prototype.getTransactionCount([BlockTag = "latest"]) => Promise<number>`
获取`nonce`

- `prototype.sendTransaction(TransactionRequest) => Promise<TransactionResponse>`
发送交易请求，获取交易响应

- `prototype.signMessage(message) => Promise<hex>`
注册信息

- `prototype.unlock(password) => Promise<Boolean>`
解锁账户