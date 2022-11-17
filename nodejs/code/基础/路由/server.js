/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-15 08:44:39
 * @LastEditTime: 2022-11-15 11:02:29
 */
const http = require("http");

const Route = {};

// 合并路由
function use(route) {
  Object.assign(Route, route);
}
// 服务
function server() {
  http
    .createServer((req, res) => {
      const myURL = new URL(req.url, "http://127.0.0.1");
      try {
        Route[myURL.pathname](res, req);
      } catch (error) {
        Route["/404"](res, req);
      }
    })
    .listen(5000, () => {
      console.log("service start");
    });
}

module.exports = {
  use,
  server,
};
