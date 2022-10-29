/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 19:04:48
 */
const fs = require("fs-extra");

// 删除目录
// fs.rmdir("./pic", (err) => {
//   console.log("err: ", err);
//   if (err && err.code === "ENOENT") {
//     console.log("目录不存在");
//   } else {
//     console.log("目录删除成功");
//   }
// });

// 递归调用删除目录
const rmdir = (path = "./avatar") => {
  try {
    fs.readdir(path, (err, data) => {
      if (data.length) {
        data.forEach((item) => {
          fs.stat(`${path}/${item}`, (e, d) => {
            if (d.isFile()) {
              fs.unlinkSync(`${path}/${item}`);
            } else {
              rmdir(`${path}/${item}`);
            }
          });
        });
        fs.rmdirSync(path);
      } else {
      }
    });
  } catch (error) {
    console.log("error---: ", error);
  }
};
rmdir();
