/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-31 14:42:57
 */
const fs = require("fs/promises");

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
try {
  fs.rm("./avatar", {
    recursive: true,
  });
} catch (error) {
  console.log("error---: ", error);
}
