/*
 * @Descripttion: 提议
 * @Author: lizhengxing
 * @Date: 2022-11-13 09:28:56
 * @LastEditTime: 2022-11-13 10:33:10
 */
const fs = require("fs");
const { ethers, network } = require("hardhat");
const {
  FUNC,
  NEW_STORE_VAlUE,
  PROPOSAl_DESCRIPTION,
  developmentChainIds,
  VOTING_DELAY,
  PROPOSAl_FILE,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const chainId = network.config.chainId;

async function propose(args, functionToCall, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall, // string
    args // any[]
  );
  console.log("encodedFunctionCall: ", encodedFunctionCall);
  const proposeTx = await governor.propose(
    [box.address], // address[]
    [0], // values
    [encodedFunctionCall], // calldatas
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);
  console.log("proposeReceipt: ");

  // 因为有延迟，在本地可以使用加速
  if (developmentChainIds.includes(parseInt(chainId))) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  // 通过事件拿到 id
  const proposalId = proposeReceipt.events[0].args.proposalId;
  // 将 id 保存下来
  storeProposalId(proposalId.toString());
}

function storeProposalId(proposalId) {
  const proposalIdInfo = JSON.parse(
    fs.readFileSync(PROPOSAl_FILE, {
      encoding: "utf-8",
    })
  );
  if (chainId in proposalIdInfo) {
    if (!proposalIdInfo[chainId].includes(proposalId)) {
      proposalIdInfo[chainId].push(proposalId);
    }
  } else {
    proposalIdInfo[chainId] = [proposalId];
  }
  fs.writeFileSync(PROPOSAl_FILE, JSON.stringify(proposalIdInfo));
}

propose([NEW_STORE_VAlUE], FUNC, PROPOSAl_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error: ", error);
    process.exit(1);
  });

module.exports = {
  propose,
};
