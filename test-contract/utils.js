const {
  U8Value,
  ArrayVecType,
  U8Type,
  ArrayVec,
  List,
  ListType,
} = require("@elrondnetwork/erdjs");

const formatHexToU8 = (hex) => {
  const _hex = hex.toString().replace("0x", "");
  const data = Buffer.from(_hex, "hex");
  const u8Array = [];
  data.map((d) => {
    u8Array.push(new U8Value(d));
  });
  return u8Array;
};

const formProofs = (list) => {
  let proofs = [];
  list.forEach((proof) => {
    let arrangedProof = new ArrayVec(
      new ArrayVecType(32, new U8Type()),
      formatHexToU8(proof)
    );
    proofs.push(arrangedProof);
  });
  return new List(new ListType(new ArrayVecType(32, new U8Type())), proofs);
};

module.exports = { formatHexToU8, formProofs };
