/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-06 15:34:48
 * @LastEditTime: 2022-11-06 15:43:09
 */
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const initialSupply = 50;
  log("开始部署");
  const ourToken = await deploy("OurToken", {
    from: deployer,
    args: [initialSupply],
    log: true,
    waitConfirmations: 1,
  });
  log(`OurToken部署完成，地址${ourToken.address}`);
};

module.exports.tags = ["all", "ot"];
