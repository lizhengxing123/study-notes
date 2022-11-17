/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-15 08:44:39
 * @LastEditTime: 2022-11-15 10:51:15
 */
const fs = require("fs");

function render(res, data) {
  res.writeHead(200, {
    "Content-Type": `application/json;charset=utf-8;`,
  });
  res.write(data);
  res.end();
}

const route = {
  "/api/login": (res, req) => {
    // 获取参数
    const myURL = new URL(req.url, "http://127.0.0.1");
    const username = myURL.searchParams.get("username");
    const password = myURL.searchParams.get("password");
    render(res, `{"username": ${username},"password":${password}}`);
  },
  "/api/loginPost": (res, req) => {
    // 获取参数
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk;
    });
    req.on("end", (chunk) => {
      const postDataObj = JSON.parse(postData);
      const username = postDataObj.username;
      const password = postDataObj.password;
      render(res, `{"username": ${username},"password":${password}}`);
    });
  },
};

module.exports = route;
