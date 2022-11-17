/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:30:17
 */
const fs = require("fs-extra");

// 读文件，第二个参数指定类型
fs.readFile("./avatar/a.md", "utf-8", (err, data) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("文件不存在");
  } else {
    // 默认返回Buffer，可使用toString转换， 也可以在第二个参数传入类型
    // console.log("data: ", data.toString("utf-8"));
    console.log("data: ", data);
  }
});
