/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-13 09:28:37
 * @LastEditTime: 2022-11-13 11:42:11
 */
const { ethers, network } = require("hardhat");
const {
  FUNC,
  NEW_STORE_VAlUE,
  PROPOSAl_DESCRIPTION,
  developmentChainIds,
  MIN_DELAY,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
const { moveTime } = require("../utils/move-time");

const chainId = network.config.chainId;

async function queueAndExecute() {
  const accounts = await ethers.getSigners();
  const player = accounts[1];
  const args = [NEW_STORE_VAlUE];
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAl_DESCRIPTION)
  );

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing ...");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  if (developmentChainIds.includes(parseInt(chainId))) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing ...");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);

  const boxNewValue = await box.retrieve();
  console.log("boxNewValue: ", boxNewValue.toString());
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error: ", error);
    process.exit(1);
  });
