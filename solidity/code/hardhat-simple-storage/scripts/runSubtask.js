/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-14 22:21:29
 * @LastEditTime: 2022-11-14 22:23:13
 */
const { run } = require("hardhat");
async function main() {
  await run("print", { message: "12345" });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error: ", error);
    process.exit(1);
  });
