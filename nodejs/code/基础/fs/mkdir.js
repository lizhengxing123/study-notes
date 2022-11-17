/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:30:30
 */
const fs = require("fs-extra");

// 创建目录
fs.mkdir("./avatar", (err) => {
  console.log("err: ", err);
  if (err && err.code === "EEXIST") {
    console.log("目录已经存在");
  } else {
    console.log("目录创建成功");
  }
});
