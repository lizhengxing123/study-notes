## ERC20

可替代代币，任何一个代币都完全等于其他代币，可用于交换代币、投票、质押等。

[合约为：](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

ERC20需要实现的功能有：

- `name` - 代币名称
- `symbol` - 代币符号
- `decimals` - 小数，通常为18
- `totalSupply` - 代币的总发行量
- `transfer(address _to, uint256 _value)` - 转移代币
- `transferFrom(address _from, address _to, uint256 _value)` - 从一个账户转移
- `approve(address _spender, uint256 _value)` - 允许`spender`从当前账户转移的代币数量，返回是否设置成功
- `allowance(address _owner, address _spender)` - 返回`owner`允许`spender`消费的代币量