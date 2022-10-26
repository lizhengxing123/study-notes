/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-17 20:46:18
 * @LastEditTime: 2022-10-26 20:03:50
 */
const ethers = require("ethers");
const fs = require("fs-extra");

function base() {
  // ganache rpc地址
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
  );
  // ganache 一个账户的私钥
  const wallet = new ethers.Wallet(
    "93c26610088920b548367ca06b638b7ad07be05b8393eee2836c9f43a5893db3",
    provider
  );
  // 编译后的abi文件
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  // 编译后的二进制文件
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  return {
    provider,
    wallet,
    abi,
    binary,
  };
}
async function main() {
  const { provider, wallet, abi, binary } = base();
  // 合约工厂
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("合约正在部署中");
  // 等待合约部署完成之后，拿到合约
  const contract = await contractFactory.deploy();
  // console.log("contract: ", contract);
  // 部署合同的交易详细信息，等待一个区块后拿到
  const transactionReceipt = await contract.deployTransaction.wait(1);
  // console.log("transactionReceipt: ", transactionReceipt);
  // 获取合约中的信息
  // 获取FavoriteNumber
  const currentFavoriteNumber = await contract.retrieve();
  console.log("currentFavoriteNumber: ", currentFavoriteNumber.toString());
  //存储FavoriteNumber
  const storeResponse = await contract.store("123");
  await storeResponse.wait(1);
  // 获取更新后的FavoriteNumber
  const updateFavoriteNumber = await contract.retrieve();
  console.log("updateFavoriteNumber: ", updateFavoriteNumber.toString());
}

async function deployWithTX() {
  // 根据交易信息部署合约
  const { provider, wallet, abi, binary } = base();
  const nonce = await wallet.getTransactionCount();
  const tx = {
    nonce,
    to: null,
    gasPrice: 20000000000,
    gasLimit: 1000000,
    value: 0,
    chainId: 5777, // ganache network ID
    data: "", // 二进制数据
  };
  const sentResponse = await wallet.sendTransaction(tx);
  await sentResponse.wait(1);
  console.log("sentResponse: ", sentResponse);
}
async function myProvider() {
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
  );
  // console.log("blockNumber: ", provider.blockNumber);
  // console.log("polling: ", provider.polling);
  // console.log("pollingInterval: ", provider.pollingInterval);
  // console.log("connection: ", provider.connection);
  // console.log("path: ", provider.path);
  // console.log("apiAccessToken: ", provider.apiAccessToken);
  const defaultProvider = new ethers.providers.EtherscanProvider("goerli");
  // const network = await defaultProvider.getNetwork();
  // console.log("network: ", network);
  // const balance = await provider.getBalance(
  //   "0xd840156c87BCC544706df3BCb1e1731e72F9D464"
  // );
  // console.log("balance: ", ethers.utils.formatEther(balance));
  // const count = await provider.getTransactionCount(
  //   "0xd840156c87BCC544706df3BCb1e1731e72F9D464"
  // );
  // console.log("count: ", count);
  // const provider = ethers.getDefaultProvider("ropsten");
  // console.log(
  //   "getCode: ",
  //   await provider.getCode("0xd840156c87BCC544706df3BCb1e1731e72F9D464")
  // );
  // console.log(
  //   "getStorageAt: ",
  //   await provider.getStorageAt("0xd840156c87BCC544706df3BCb1e1731e72F9D464", 0)
  // );
  const accounts = await provider.listAccounts();
  const signer = await provider.getSigner(accounts[0]);
  console.log("signer.getAddress: ", await signer.getAddress());
  console.log(
    "signer.getTransactionCount: ",
    await signer.getTransactionCount()
  );
  console.log(
    "signer.getBalance: ",
    ethers.utils.formatEther(await signer.getBalance())
  );
  console.log("signer.signMessage: ", provider.signMessage("123"));
}

myProvider();
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.log("error: ", error);
//     process.exit(1);
//   });
