/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-13 09:28:37
 * @LastEditTime: 2022-11-13 11:29:17
 */
const fs = require("fs");
const { network, ethers } = require("hardhat");
const {
  developmentChainIds,
  PROPOSAl_FILE,
  VOTING_DELAY,
} = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");
const chainId = network.config.chainId;
const INDEX = 0;

async function main(proposalIndex) {
  const proposals = JSON.parse(fs.readFileSync(PROPOSAl_FILE), {
    encoding: "utf-8",
  });
  const proposalId = proposals[chainId][proposalIndex];
  console.log("proposalId: ", proposalId);
  // 0 - 反对
  // 1 - 赞成
  // 2 - 弃权
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I like";
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTx.wait(1);
  if (developmentChainIds.includes(parseInt(chainId))) {
    await moveBlocks(VOTING_DELAY + 100);
  }
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
  console.log("Voted");
}

main(INDEX)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error: ", error);
    process.exit(1);
  });
