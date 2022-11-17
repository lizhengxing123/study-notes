/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-15 08:44:39
 * @LastEditTime: 2022-11-15 11:21:45
 */
const fs = require("fs");
const path = require("path");

function render(res, path, type, code) {
  res.writeHead(code ? code : 200, {
    "Content-Type": `${type ? type : "text/html"};charset=utf-8;`,
  });
  res.write(
    fs.readFileSync(path, {
      encoding: "utf-8",
    })
  );
  res.end();
}

const route = {
  "/": (res) => {
    render(res, "./static/home.html");
  },
  "/home": (res) => {
    render(res, "./static/home.html");
  },
  "/login": (res) => {
    render(res, "./static/login.html");
  },
  "/404": (res, req) => {
    if (readStaticFile(res, req)) {
      return;
    }
    render(res, "./static/404.html", "", 404);
  },
  "/favicon.ico": (res) => {
    render(res, "./static/favicon.ico", "image/x-icon");
  },
};

function readStaticFile(res, req) {
  const myURL = new URL(req.url, "http://127.0.0.1");
  const pathname = path.join(__dirname, "/static", myURL.pathname);
  if (fs.existsSync(pathname)) {
    render(res, pathname, "");
    return true;
  }
  return false;
}

module.exports = route;
