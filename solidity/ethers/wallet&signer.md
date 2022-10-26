<!--
 * @Descripttion: 
 * @Author: lizhengxing
 * @Date: 2022-10-24 19:37:33
 * @LastEditTime: 2022-10-24 22:16:35
-->

## 钱包类Wallet和签名器Signer

#### 钱包类Wallet

钱包类管理着一个公私钥对用于在以太坊网络上密码签名交易以及所有权证明

##### 创建 Wallet 实例

- `new Wallet(privateKey[, provider])`
从参数`privateKey`创建一个钱包实例，还可以提供一个可选的`provider`参数用于连接节点

- `Wallet.createRandom([options]) => Wallet`
创建一个随机钱包实例。确保私钥存放在安全位置，如果丢失了就没有办法找回钱包。
额外的参数`options`为：
  -  `extraEntropy` - 额外的熵加入随机源

- `Wallet.fromEncryptedJson(json, password[, progressCallback]) => Wallet`
通过解密一个`JSON`钱包文件创建钱包实例，`JSON`钱包文件，即`keystore`文件，通常来自`Geth``parity``Crowdsale`等钱包或工具，或者通过钱包加密函数创建

- `Wallet.fromMnemonic(mnemonic[, path="m/44'/60'/0'/0'/0"[, wordList]]) => Wallet`
通过助记词及路径创建钱包实例，助记词及路径由`BIP-039`和`BIP-044`定义，默认使用英文助记词。以太坊钱包遵循`BIP44`标准，确定路径是`"m/44'/60'/a'/0'/n"`：
    - `44`是固定的
    - `60`代表币种为以太坊，`0`代表比特币，`1`代表比特币测试链
    - `a`代表账户
    - `0`代表外部（收款地址，用于接收付款），`1`用于内部，用于返回交易变更，**一般使用0**
    - `n`代表第`n`个生成的地址

    当前支持的单词语言列表为：`ethers.wordlists.en``ethers.wordlists.it``ethers.wordlists.ja``ethers.wordlists.ko``ethers.wordlists.zh_cn``ethers.wordlists.zh_tw`

- `prototype.connect(provider) => Wallet`
从已有实例创建新的实例，并连接到新的`provider`
  
```js
// 加载私钥
const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
const wallet = new ethers.Wallet(private);

const provider = ethers.getDefaultProvider();
const walletWithProvider = new ethers.Wallet(privateKey, provider);

// 创建一个随机钱包实例
const randomWallet = ethers.Wallet.createRandom();

// 加载 JSON 钱包文件
const data = {
    id: "fb1280c0-d646-4e40-9550-7026b1be504a",
    address: "88a5c2d9919e46f883eb62f7b8dd9d0cc45bc290",
    Crypto: {
        kdfparams: {
            dklen: 32,
            p: 1,
            salt: "bbfa53547e3e3bfcc9786a2cbef8504a5031d82734ecef02153e29daeed658fd",
            r: 8,
            n: 262144
        },
        kdf: "scrypt",
        ciphertext: "10adcc8bcaf49474c6710460e0dc974331f71ee4c7baa7314b4a23d25fd6c406",
        mac: "1cf53b5ae8d75f8c037b453e7c3c61b010225d916768a6b145adf5cf9cb3a703",
        cipher: "aes-128-ctr",
        cipherparams: {
            iv: "1dcdf13e49cea706994ed38804f6d171"
         }
    },
    version: 3
};
const json = JSON.stringify(data);
const password = "foo"
ethers.Wallet.fromEncryptedJson(json, password).then(wallet => {
    console.log('Address: ', wallet.address);
    // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"
})

// 加载助记词
const mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
// 从助记词加载第二个账户
const path = "m/44'/60'/1'/0'/0";
const secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
// 使用非英语语言环境的单词列表（将path设为null来使用默认值）
const wordlistsMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, null, ethers.wordlists.zh_cn);
```

##### 原型属性

- `prototype.address`：钱包地址
- `prototype.privateKey`：钱包私钥
- `prototype.provider`：钱包`provider`，没有返回`null`。若要改变`provider`，使用`connect`方法，返回新`provider`的钱包实例
- `prototype.path`：钱包助记词的`path`，没有返回`null`
- `prototype.mnemonic`：钱包助记词，没有返回`null`

```js
const w = ethers.Wallet.createRandom();
console.log("w.address: ", w.address); // 0xfdaA0b5ad29F03144C29df49172a61Ae86f3b51F
console.log("w.privateKey: ", w.privateKey); // 0x5f86b9e98479e6d62b37788d957a63de67ea1777a04fb3ef8327a0f23c0e0c24
console.log("w.provider: ", w.provider); // null
console.log("w.path: ", w.path); // undefined
console.log("w.mnemonic: ", w.mnemonic); 
// { 
//     phrase: 'cotton meat solve actual three salad crystal below buyer collect cheese error',
//     path: "m/44'/60'/0'/0/0",
//     locale: 'en' 
// }
```

##### 签名方法

- `prototype.sign(transaction) => Promise<string>`
对交易签名返回一个`Promise`，从`Promise`可以获取一个签名后的`hash`16进制字符串。通常应该使用`sendTransaction`。交易的属性字段都是可选的，包括：
    - `to`：接首者
    - `gasLimit`：`gas`上限
    - `gasPrice`：`gas`价格
    - `nonce`：交易数量
    - `data`：数据
    - `value`：发送的以太币
    - `chainId`：链`id`

- `prototype.signMessage(message) => Promise<string>`
对`message`签名返回`Promise`，从中可以获取`flat-format`的签名信息。如果`message`是一个字符串，它被转换为`UTF-8`字节，否则使用数据用`Arrayish`表示的二进制

```js
// 交易签名
const privateKey = "0x3141592653589793238462643383279502884197169399375105820974944592";
const wallet = new ethers.Wallet(privateKey);
console.log('wallet.address: ', wallet.address);
const transaction = {
    to: "0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290",
    // 或者是支持ENS名称
    // to: "ricmoo.firefly.eth",
    nonce: 0,
    gasLimit: 21000,
    gasPrice: utils.bigNumberify("20000000000"),
    value: utils.parseEther("1.0"),
    data: "0x",
    // 这可确保无法在不同网络上重复广播
    chainId: ethers.utils.getNetwork('homestead').chainId
}
const signedTransaction = await wallet.sign(transaction)
console.log('signedTransaction: ', signedTransaction);
// 发送到以太坊网络
const provider = ethers.getDefaultProvider();
const tx = provider.sendTransaction(signedTransaction)
console.log('tx: ', tx);

// 签名文本信息
const signature = await wallet.signMessage("Hello World!")
console.log('signature: ', signature);
// Flat-format
// 0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c1c
// Expanded-format
console.log(ethers.utils.splitSignature(signature));
// {
//   r:'0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474',
//   s:'0x301198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c',
//   _vs:'0xb01198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c',
//   recoveryParam: 1,
//   v: 28,
//   yParityAndS:'0xb01198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c',
//   compact:'0xea09d6e94e52b48489bd66754c9c02a772f029d4a2f136bba9917ab3042a0474b01198d8c2afb71351753436b7e5a420745fed77b6c3089bbcca64113575ec3c' 
// }

// 签名二进制信息
const hash = "0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0"
const binaryData = ethers.utils.arrayify(hash)
const binarySignature = await wallet.signMessage(binaryData)
console.log('binarySignature: ', binarySignature);
// 0x5e9b7a7bd77ac21372939d386342ae58081a33bf53479152c87c1e787c27d06b118d3eccff0ace49891e192049e16b5210047068384772ba1fdb33bbcba580391c
```

##### 与链交互

这些操作要求钱包关联了一个`provider`

- `prototype.getBalance([blockTag = "latest"]) => Promise<BigNumber>`
返回一个包含钱包余额的`Promise`，单位为`wei`，可选参数为`blockTag`

- `prototype.getTransactionCount([blockTag = "latest"]) => Promise<number>`
返回一个包含账户已经发送交易数量（`nonce`）的`Promise`，可选参数为`blockTag`

- `prototype.estimateGas(transaction) => Promise<BigNumber>`
返回给定交易需要的`gas`

- `prototype.sendTransaction(transaction) => Promise<TransactionResponse>`
发送交易到网络，返回一个可以`TransactionResponse`的`Promise`，ren he任何没有提供的属性将从网络获取填充

```js
// 查询交易
const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
const provider = ethers.getDefaultProvider();
const wallet = new ethers.Wallet(privateKey, provider);

const balance = await wallet.getBalance();
console.log('balance: ', balance); 
// BigNumber { _hex: '0x1b48eb57e000', _isBigNumber: true }
const nonce = await wallet.getTransactionCount();
console.log('nonce: ', nonce);
// 1447

// 发送以太
const amount = ethers.utils.parseEther("1.0")
const tx = {
    to: "0x88a5c2d9919e46f883eb62f7b8dd9d0cc45bc290",
    value: amount
}
const transactionResponse = await wallet.sendTransaction(tx);
console.log('transactionResponse: ', transactionResponse);
```

##### 处理加密的JSON钱包文件

很多系统以各种格式将私钥存储为加密的`JSON`钱包文件(`keystore`)，`keystore`有好几种使用的格式和算法。只有经过正确安全的密码验证才可以生成`keystore`或解密出`Wallet`对象

- `prototype.encrypt(password[, options[, progressCallback]]) => Promise<string>`
使用密码加密钱包生成加密的`JSON`钱包文件(`keystore`)，参数`options`是可选的，有效选项有：
    - `slat`： `scrypt`（一个密钥衍生算法的）盐
    - `iv`：`aes-ctr-128 `需要使用的初始化矢量
    - `uuid`：钱包要用的`UUID`
    - `scrypt`：`scrypt`算法需要的参数（N、r、p）
    - `entropy`：钱包的助记词熵，通常不指定
    - `mnemonic`：钱包的助记词，通常不指定
    - `path`：钱包的助记词路径，通常不指定

    如果使用了`progressCallback`，它将在加密期间周期的调用参数指定的函数，函数需要指定一个参数，用来接收进度（`[0, 1]`）

```js
// 加密钱包输出
const privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
const provider = ethers.getDefaultProvider();
const wallet = new ethers.Wallet(privateKey, provider);
const password = "password123"

function callback(progress) {
    console.log("Encrypting: " + parseInt(progress * 100) + "% complete");
}

const encrypt = await wallet.encrypt(password, callback)
console.log('encrypt: ', encrypt);
// {
//     "address":"14791697260e4c9a71f18484c9f997b308e59325",
//     "id":"7a3cd7a6-8421-43e1-919d-5db676a5bc64",
//     "version":3,
//     "crypto":{
//         "cipher":"aes-128-ctr",
//         "cipherparams":{
//             "iv":"e71afe11add433945556db6b5d45254a"
//         },
//         "ciphertext":"c3f48c08103f758cb7a18c25508fd8f4df1b28b0ccdea4b039574d53406b4216",
//         "kdf":"scrypt",
//         "kdfparams":{
//             "salt":"00368adb40ae44fdf767a06f10a671b0be7f9e7697382150714da7ffd255cd61",
//             "n":131072,
//             "dklen":32,
//             "p":1,
//             "r":8
//         },
//         "mac":"592ff022ea6344fdaef2bece6cabf0d4ce009e5e9e9af7d2124505db9faadfb5"
//     }
// }
```

#### 签名器接口

签名器是一个抽象类，当需要签名器时就可以扩展使用它。钱包就是签名器的一个继承类型。

为了实现一个签名器，需要继承抽象类`ethers.types.Signer`并实现一下属性：

- `object.provider`(可选)
连接网络的`provider`。如果没有`provider`，只有`write-only`操作可以工作

- `object.getAddress() => Promise<address>`
返回账号地址的`Promise`

- `object.signMessage(message) => Promise<hex>`
返回包含信息的`flat-format``Promise`，如果`message`是一个字符串，它被转换为`UTF-8`字节，否则使用数据用`Arrayish`表示的二进制

- `object.sendTransaction(transaction) => Promise<TransactionResponse>`
发送交易到网络，返回一个可以`TransactionResponse`的`Promise`，ren he任何没有提供的属性将从网络获取填充