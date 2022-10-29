/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-28 15:39:34
 * @LastEditTime: 2022-10-28 16:37:52
 */
const fs = require("fs-extra");

// 创建目录
fs.mkdir("./avatar", (err) => {
  console.log("err: ", err);
  if (err && err.code === "EEXIST") {
    console.log("目录已经存在");
  } else {
    console.log("目录创建成功");
  }
});
// 重命名目录
fs.rename("./avatar", "./pic", (err) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("目录不存在");
  } else {
    console.log("目录重命名成功");
  }
});
// 删除目录
fs.rmdir("./pic", (err) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("目录不存在");
  } else {
    console.log("目录删除成功");
  }
});
// 如果没有文件，创建文件，并写入数据；如果存在文件，新的数据覆盖旧的数据
fs.writeFile("./avatar/a.md", "## fs", (err) => {
  console.log("err: ", err);
});
// 如果没有文件，创建文件，并写入数据；如果存在文件，新的数据追加到旧的数据后面
fs.appendFile("./avatar/b.md", "\n## fs", (err) => {
  console.log("err: ", err);
});
// 读文件，第二个参数指定类型
fs.readFile("./avatar/a.md", "utf-8", (err, data) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("文件不存在");
  } else {
    // 默认返回Buffer，可使用toString转换， 也可以在第二个参数传入类型
    // console.log("data: ", data.toString("utf-8"));
    console.log("data: ", data);
  }
});
// 删除文件
fs.unlink("./avatar/a.md", (err) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("文件不存在");
  } else {
    console.log("文件删除成功");
  }
});
// 读取目录
fs.readdir("./avatar", (err, data) => {
  console.log("err: ", err);
  if (err && err.code === "ENOENT") {
    console.log("目录不存在");
  } else {
    console.log("data: ", data); // [ 'b.md' ]
  }
});
// 目录/文件的详细信息
fs.stat("./avatar", (err, data) => {
  console.log("err: ", err);
  if (!err) {
    console.log(data.isDirectory()); // true
    console.log(data.isFile()); // false
  }
});
