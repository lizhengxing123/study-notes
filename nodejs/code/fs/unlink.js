/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:29:43
 */
const fs = require("fs-extra");

// 删除文件
fs.unlink("./avatar/a.md", (err) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("文件不存在");
  } else {
    console.log("文件删除成功");
  }
});
