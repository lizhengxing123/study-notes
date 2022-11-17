/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-31 15:50:44
 * @LastEditTime: 2022-10-31 17:52:19
 */
const crypto = require("crypto");
// md5 sha256 sha512 等类型
const hash = crypto.createHash("md5");

// 加密，可以多次调用
hash.update("lizhengxing");
// 16进制或着base64展示
console.log(hash.digest("hex")); // d422c1856dde72ea560dddc8a50503b2

// hmac算法，需要一个密钥，增强的hash算法
const hmac = crypto.createHmac("md5", "secret-key");
hmac.update("lizhengxing");
console.log(hmac.digest("hex")); // 6efa19c86bab98f677a1ea667c27a9c4

// aes对称加密
// 加密
const encrypt = (key, iv, data) => {
  const encrypted = crypto.createCipheriv("aes-128-cbc", key, iv);
  return encrypted.update(data, "binary", "hex") + encrypted.final("hex");
};
// 解密
const decrypt = (key, iv, data) => {
  data = Buffer.from(data, "hex").toString("binary");
  const dep = crypto.createDecipheriv("aes-128-cbc", key, iv);
  return dep.update(data, "binary", "utf8") + dep.final("utf8");
};
// 长度为16 16*8=128
const key = "qazwsxedcrfvtgby";
const iv = "q1zwsxedcrfvtg2y";
const data = "lizhengxing";
const e = encrypt(key, iv, data);
console.log("e: ", e); // e73aebfe321c56dce2cf6f6cce5569f2
const d = decrypt(key, iv, e);
console.log("d: ", d); // lizhengxing
