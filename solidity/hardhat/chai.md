## Chai 匹配器

#### BigNumber

- `equal、eq、above、gt、gte、below、lt、lte、least、most、within、closeTo`

```js
expect(BigNumber.from(100)).to.equal(BigNumber.from(100))
```

#### 事件

- `emit`：参数为合约和事件名称
- `widthArgs`：参数为事件参数列表
- `widthNamedArgs`：参数为事件参数对象

```js
await expect(token.transfer(walletTo.address, 7)).to.emit(token, "Transfer")

await expect(token.transfer(walletTo.address, 7))
    .to.emit(token, "Transfer")
    .withArgs(wallet.address, walletTo.address, 7)

await expect(token.transfer(walletTo.address, 7))
    .to.emit(token, "Transfer")
    .withNamedArgs({
        from: wallet.address,
        to: walletTo.address,
        amount: 7
    })
```

#### 在合约上调用函数

- `calledOnContract`：在合约上调用函数
- `calledOnContractWith`：在合约上调用函数，带有特定参数

```js
await token.balanceOf(wallet.address);

expect("balanceOf").to.be.calledOnContract(token);

expect("balanceOf").to.be.calledOnContractWith(token, [wallet.address]);
```

#### 交易被还原

- `reverted`：交易被还原
- `reverterWith`：交易被还原，带有原因

```js
await expect(token.transfer(walletTo.address, 0)).to.be.reverted;

await expect(token.transfer(walletTo.address, 0)).to.be.revertedWith("reason");
```

#### 变更账户余额

- `changeEtherBalance`：默认情况下，忽略交易费用
- `changeEtherBalances`：更改多个账户余额

```js
await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
    .to.changeEtherBalance(walletTo, 200)

await expect(await wallet.sendTransaction({to: walletTo.address, value: 200}))
    .to.changeEtherBalances([wallet, walletTo], [-200, 200])
```

#### 变更代币余额

- `changeTokenBalance`
- `changeTokenBalances`

```js
await expect(() => token.transfer(walletTo.address, 200))
    .to.changeTokenBalance(token, walletTo, 200)

await expect(() => token.transfer(walletTo.address, 200))
    .to.changeTokenBalances(token, [wallet, walletTo], [-200, 200])
```

#### 其他

- `properAddress`：测试字符串是否为一个正确的地址
- `properPrivateKey`：测试字符串是否为一个正确的私钥
- `properHex`：测试字符串是否为一个正确的给定长度的十六进制值
- `hexEqual`：测试字符串是否等于一个十六进制值

```js
expect("0x").to.be.properAddress;

expect("0x").to.be.properPrivateKey;

expect("0x1234").to.be.properHex(2);

expect("0x0001234").to.hexEqual("0x1234");
```