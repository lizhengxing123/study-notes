/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 20:16:03
 * @LastEditTime: 2022-11-13 11:41:57
 */
// 网络配置
const networkConfig = {
  // goerli的chainId为5
  5: {
    // 名称
    name: "goerli",
  },
  31337: {
    name: "hardhat",
  },
};
// 本地开发链
const developmentChainIds = [31337];
// time lock args
const MIN_DELAY = 3600; // 1 hour
// governor contract args
const VOTING_DELAY = 1;
const VOTING_PERIOD = 5;
const QUORUM_PERCENTAGE = 4;

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const NEW_STORE_VAlUE = 77;
const FUNC = "store";
const PROPOSAl_DESCRIPTION = "Proposal #1: Store 77 in the Box.";
const PROPOSAl_FILE = "proposal.json";

module.exports = {
  networkConfig,
  developmentChainIds,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  NEW_STORE_VAlUE,
  FUNC,
  PROPOSAl_DESCRIPTION,
  PROPOSAl_FILE,
  ADDRESS_ZERO,
};
