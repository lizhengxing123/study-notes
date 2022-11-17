/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-25 15:09:09
 * @LastEditTime: 2022-10-26 16:35:18
 */
const http = require("http");
const https = require("https");
// const { URL } = require("url");

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    return;
  }
  //   const urlObj = url.parse(req.url, true);
  const urlObj = new URL(req.url, "http://127.0.0.1:8000/");
  console.log("urlObj: ", urlObj);
  console.log("a: ", urlObj.searchParams.get("a"));
  // 响应头
  for (const [key, value] of urlObj.searchParams) {
    console.log("set: ", value);
  }
  res.writeHead(200, { "Content-type": "text/html;charset=utf-8" });
  // 响应内容
  res.write(renderHTML(urlObj.pathname));
  res.end();
});

server.listen(8000, () => {
  console.log("server start");
});

function renderHTML(url) {
  let result = "";
  switch (url) {
    case "/list":
      result = `<h1>list页面</h1>`;
      break;
    case "/home":
      result = `<h1>home页面</h1>`;
      break;
    case "/api/home":
      result = `{name: "lzx"}`;
      break;
    case "/api/list":
      result = `["list1", "list2", "list3"]`;
      break;
    default:
      result = `<h1>not found</h1>`;
      break;
  }
  return result;
}
