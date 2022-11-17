/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-25 15:09:09
 * @LastEditTime: 2022-10-26 16:44:42
 */
const http = require("http");
const https = require("https");

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    return;
  }
  const urlObj = new URL(req.url, "http://127.0.0.1:8000/");
  if (urlObj.pathname === "/api/maoyan") {
    console.log("urlObj.pathname: ", urlObj.pathname);
    httpsGet(res);
  }
});

server.listen(8000, () => {
  console.log("server start");
});

function httpsGet(response) {
  let str = "";
  https.get(
    "https://i.maoyan.com/api/mmdb/movie/v3/list/hot.json?ct=%E5%85%B0%E5%B7%9E&ci=361&channelId=4",
    (res) => {
      // console.log("res: ", res);
      res.on("data", (chunk) => {
        str += chunk;
      });
      res.on("end", () => {
        // console.log("str: ", str);
        response.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        response.write(str);
        response.end();
      });
    }
  );
}
