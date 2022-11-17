/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-11-15 14:36:55
 * @LastEditTime: 2022-11-15 15:09:09
 */
const express = require("express");

const app = express();

app.get(
  "/",
  (req, res, next) => {
    next();
  },
  (req, res) => {
    res.send("Home");
  }
);

app.listen(5000, () => {
  console.log("server started");
});
