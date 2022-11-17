/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:30:41
 */
const fs = require("fs-extra");

// 如果没有文件，创建文件，并写入数据；如果存在文件，新的数据追加到旧的数据后面
fs.appendFile("./avatar/b.md", "\n## fs", (err) => {
  console.log("err: ", err);
});
