/*
 * @Descripttion:
 * @Author: lizhengxing
 * @Date: 2022-10-27 19:37:15
 * @LastEditTime: 2022-10-27 20:35:22
 */
const ethers = require("ethers");

function main() {
  // address
  const address = "0xd115bffabbdd893a6f7cea402e7338643ced44a6";
  const icapAddress = "XE93OF8SR0OWI6F4FO88KWO4UNNGG1FEBHI";
  console.log(ethers.utils.getAddress(address));
  console.log(ethers.utils.getAddress(icapAddress));
  console.log(ethers.utils.getIcapAddress(icapAddress));
  console.log(ethers.utils.getIcapAddress(icapAddress));
  const transaction = {
    from: "0xc6af6e1a78a6752c7f8cd63877eb789a2adb776c",
    nonce: 0,
    value: 0,
  };
  console.log(ethers.utils.getContractAddress(transaction));

  // arrayish
  const array = [0, 1, 2, 3];
  const hex = "0x1234";
  // ethers.utils.isArrayish is not a function
  // console.log(ethers.utils.isArrayish(array));
  console.log(ethers.utils.arrayify(array));
  console.log(ethers.utils.arrayify(hex));
  console.log(ethers.utils.concat([hex, array]));
  console.log(ethers.utils.stripZeros(hex));

  // bigNumber
  const a = ethers.BigNumber.from(42);
  console.log("a: ", a);

  // bytes32
  const text = "Hello World!";
  const bytes32 = ethers.utils.formatBytes32String(text);
  console.log("bytes32: ", bytes32);
  const originalText = ethers.utils.parseBytes32String(bytes32);
  console.log("originalText: ", originalText);

  // constants
  console.log(ethers.constants.AddressZero);
  console.log(ethers.constants.Zero);
  console.log(ethers.constants.One);
  console.log(ethers.constants.Two);
  console.log(ethers.constants.NegativeOne);
  console.log(ethers.constants.WeiPerEther);
  console.log(ethers.constants.EtherSymbol);
}

main();
