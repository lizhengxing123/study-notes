/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-26 20:26:27
 * @LastEditTime: 2022-10-26 21:13:45
 */
const ethers = require("ethers");
const fs = require("fs");

async function myContract() {
  const provider = new ethers.providers.JsonRpcProvider(
    "HTTP://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet(
    "93c26610088920b548367ca06b638b7ad07be05b8393eee2836c9f43a5893db3",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage2_sol_SimpleStorage.abi", "utf8");
  // 编译后的二进制文件
  const binary = fs.readFileSync(
    "./SimpleStorage2_sol_SimpleStorage.bin",
    "utf8"
  );
  //   // 合约工厂
  //   const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  //   // 部署合约 -- 传入参数
  //   const contract = await contractFactory.deploy("lzx");
  //   console.log("contract.address: ", contract.address);
  //   // 合约交易信息 -- 交易响应
  //   console.log("contract.deployTransaction: ", contract.deployTransaction);
  //   await contract.deployed();
  //   console.log("contract: ", contract);
  // 连接已有合约
  const contract = new ethers.Contract(
    "0xf0638a6A1B04DCD08464F90C3b2eae6050750c45",
    abi,
    wallet
  );
  const currentValue = await contract.getValue();
  console.log("currentValue: ", currentValue); // lzx

  const tx = await contract.setValue("hahaha");
  //   console.log("tx: ", tx);
  const receipt = await tx.wait();
  //   console.log("receipt: ", receipt);
  const updateValue = await contract.getValue();
  console.log("updateValue: ", updateValue); // hahaha

  // 监听事件
  contract.on("ValueChanged", (author, oldValue, newValue, event) => {
    console.log("author: ", author);
    console.log("oldValue: ", oldValue);
    console.log("newValue: ", newValue);
    console.log("event.blockNumber: ", event.blockNumber);
  });

  const filter = contract.filters.ValueChanged(wallet.address);
  console.log("filter: ", filter);
  contract.on(filter, (author, oldValue, newValue, event) => {
    // 只有签名器的地址更改数据菜回调
  });
}

myContract();
