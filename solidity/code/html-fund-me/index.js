/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-02 16:21:26
 * @LastEditTime: 2022-11-02 21:24:33
 */
// ethers
import { ethers } from "./ethers.js";
// 会报跨域
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constant.js";

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const fundButton = document.getElementById("fundButton");
fundButton.onclick = fund;
const balanceButton = document.getElementById("balanceButton");
balanceButton.onclick = getBalance;
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;

// 连接metamask
async function connect() {
  // 检查metamask是否存在
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("连接成功");
      connectButton.innerHTML = "已连接 Metamask";
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // 用户拒绝连接
        console.log("用户拒绝连接");
      } else {
        console.error(err);
      }
    }
  } else {
    alert("没有Metamask");
  }
}
// getBalance
async function getBalance() {
  if (window.ethereum) {
    // 连接区块链
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    alert(`合同余额为 ${ethers.utils.formatEther(balance)} ETH`);
  }
}
// fund
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("ethAmount: ", ethAmount);
  if (ethAmount <= 0) {
    return;
  }
  if (window.ethereum) {
    // 连接区块链
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log("provider: ", await provider.getNetwork());
    // 我们的钱包账户
    const signer = provider.getSigner();
    // console.log("signer: ", await signer.getAddress());
    // console.log("signer: ", await signer.getChainId());
    // console.log("signer: ", await signer.getBalance());
    // 合约
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // 交易响应
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // 等待交易完成
      const transactionReceipt = await listenForTransactionMine(
        transactionResponse,
        provider
      );
      console.log(`交易完成，${transactionReceipt.confirmations}个区块被确认`);
    } catch (error) {
      console.log("error: ", error);
    }
  }
}
// 监听交易完成
function listenForTransactionMine(transactionResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      resolve(transactionReceipt);
    });
  });
}

// 提取
async function withdraw() {
  if (window.ethereum) {
    // 连接区块链
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 我们的钱包账户
    const signer = provider.getSigner();
    // 合约
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // 交易响应
    try {
      const transactionResponse = await contract.withdraw();
      // 等待交易完成
      const transactionReceipt = await listenForTransactionMine(
        transactionResponse,
        provider
      );
      console.log(`交易完成，${transactionReceipt.confirmations}个区块被确认`);
    } catch (error) {
      console.log("error: ", error);
    }
  }
}
