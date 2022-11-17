/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 15:02:51
 * @LastEditTime: 2022-10-31 15:15:09
 */
const fs = require("fs");

// 读
const rs = fs.createReadStream("./1.txt", "utf-8");

rs.on("data", (chunk) => {
  console.log("chunk: ", chunk);
});

rs.on("end", () => {
  console.log("end: ");
});

rs.on("error", (err) => {
  console.log("err: ", err);
});

// 写
const ws = fs.createWriteStream("./2.txt", "utf8");

ws.write("11111");
ws.write("22222");
ws.write("33333");
ws.end();

// 边读边写
rs.pipe(ws);
