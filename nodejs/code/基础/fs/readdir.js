/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:33:05
 */
const fs = require("fs-extra");

// 读取目录
fs.readdir("./avatar", (err, data) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("目录不存在");
  } else {
    console.log("data: ", data); // [ 'b.md' ]
  }
});
