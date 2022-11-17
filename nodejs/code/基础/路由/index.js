/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-15 09:39:10
 * @LastEditTime: 2022-11-15 10:22:14
 */
const { server, use } = require("./server");
const route = require("./route");
const api = require("./api");
// 合并路由
use(route);
use(api);
// 启动服务
server();
