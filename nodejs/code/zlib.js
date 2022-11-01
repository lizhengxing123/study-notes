/*
 * @Descripttion: gzip压缩
 * @Author: lizhengxing
 * @Date: 2022-10-31 15:15:15
 * @LastEditTime: 2022-10-31 15:39:17
 */
const http = require("http");
const fs = require("fs");
const zlib = require("zlib");
const gzip = zlib.createGzip();

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain;charset=utf-8",
      "Content-Encoding": "gzip",
    });
    const readStream = fs.createReadStream(
      "../../solidity/1、基本语法/2、类型.md",
      "utf-8"
    );
    // res为可写流
    readStream.pipe(gzip).pipe(res);
  })
  .listen(3002, () => {
    console.log("start");
  });
