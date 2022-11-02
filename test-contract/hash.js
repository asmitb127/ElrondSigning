const keccak256 = require("keccak256");
const { Address } = require("@elrondnetwork/erdjs");

const buf = Buffer.from(
  new Address("erd1cgcvwt6sjsdrd5ug6kmafnk6t86mk9vdgxac7tp8lhazxdsesqyqwtqlvn")
    .valueHex,
  "hex"
);

let adfafs = keccak256(buf);
console.log(adfafs.toString("hex"));
