/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 20:08:21
 * @LastEditTime: 2022-10-29 20:58:37
 */
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
  // 合约工厂
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  // 部署合约
  const simpleStorage = await SimpleStorage.deploy();
  // 等待合约部署完成
  await simpleStorage.deployed();
  console.log(`SimpleStorage deployed at ${simpleStorage.address} `);
  // 当前部署的网络为goerli才验证
  if (hre.network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    // 合约完成之后等待几个区块在进行验证
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }
  // 与合约交互
  const currentValue = await simpleStorage.retrieve();
  console.log("currentValue: ", currentValue);

  const transactionResponse = await simpleStorage.store(12);
  transactionResponse.wait(1);

  const updateValue = await simpleStorage.retrieve();
  console.log("updateValue: ", updateValue);
}
// etherscan合约验证
async function verify(contractAddress, args) {
  try {
    // 第一个verify为验证任务，第二个verify为验证功能
    hre.run("verify:verify", {
      // 合约地址
      address: contractAddress,
      // 构造函数参数
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified", e);
    } else {
      console.log("Error", e);
    }
  }
}
main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
