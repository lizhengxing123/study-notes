/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-17 20:46:18
 * @LastEditTime: 2022-10-26 20:26:17
 */
const ethers = require("ethers");

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
