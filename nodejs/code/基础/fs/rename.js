/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:30:09
 */
const fs = require("fs-extra");

// 重命名目录
fs.rename("./avatar", "./pic", (err) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("目录不存在");
  } else {
    console.log("目录重命名成功");
  }
});
