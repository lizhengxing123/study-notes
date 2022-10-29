/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:37:06
 */
const fs = require("fs-extra");

// 目录/文件的详细信息
fs.stat("./avatar", (err, data) => {
  console.log("err: ", err);
  if (!err) {
    console.log(data.isDirectory()); // true
    console.log(data.isFile()); // false
  }
});
