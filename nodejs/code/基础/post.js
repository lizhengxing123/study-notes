/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-25 15:09:09
 * @LastEditTime: 2022-10-26 17:11:20
 */
const http = require("http");
const https = require("https");

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") {
    return;
  }
  const urlObj = new URL(req.url, "http://127.0.0.1:8000/");
  res.writeHead(200, {
    "Content-Type": "application/json;charset=utf-8",
    "access-control-allow-origin": "*",
  });
  if (urlObj.pathname === "/api/xiaomi") {
    const data = await httpsPost(res);
    res.end(data);
  }
});

server.listen(8000, () => {
  console.log("server start");
});

function httpsPost() {
  return new Promise((resolve, reject) => {
    let str = "";
    const req = https.request(
      "https://m.xiaomiyoupin.com/mtop/market/search/placeHolder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      },
      (res) => {
        // console.log("res: ", res);
        res.on("data", (chunk) => {
          str += chunk;
        });
        res.on("end", () => {
          // console.log("str: ", str);
          resolve(str);
        });
      }
    );
    req.on("error", (e) => {
      reject(e.message);
    });
    req.write(JSON.stringify([{}, { baseParam: { ypClient: 1 } }]));
    req.end();
  });
}
