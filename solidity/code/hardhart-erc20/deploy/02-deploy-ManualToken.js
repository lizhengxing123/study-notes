/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 15:43:44
 * @LastEditTime: 2022-11-06 15:48:34
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const args = [50, "ManualToken", "MT"];
  log("开始部署ManualToken");
  const manualToken = await deploy("ManualToken", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: 1,
  });
  log(`ManualToken部署完成，地址${manualToken.address}`);
};

module.exports.tags = ["all", "mt"];
