/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:13:23
 * @LastEditTime: 2022-10-28 15:15:34
 */
const EventEmitter = require("events");

const myEmitter = new EventEmitter();

myEmitter.on("play", (a) => {
  console.log("a: ", a, this);
  // 篮球 {}
});

myEmitter.on("event", function (b) {
  console.log("b: ", b, this === myEmitter);
  // music true
});

myEmitter.emit("play", "篮球");

myEmitter.emit("event", "music");
