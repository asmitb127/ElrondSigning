require("dotenv").config();
const {
  ProxyNetworkProvider,
} = require("@elrondnetwork/erdjs-network-providers");
const {
  Address,
  AbiRegistry,
  Account,
  SmartContract,
  SmartContractAbi,
  ContractFunction,
  BytesValue,
  ArrayVecType,
  U8Type,
  ArrayVec,
} = require("@elrondnetwork/erdjs");
const { UserSigner } = require("@elrondnetwork/erdjs-walletcore");
const { BigNumber } = require("bignumber.js");
const { promises, fs, readFileSync } = require("fs");

const { generateTree } = require("@checkerchain/elrond-merkle-tree-generator");
const { formatHexToU8, formProofs } = require("./utils");

const proxyProvider = new ProxyNetworkProvider("https://devnet-api.elrond.com");

//User 1
const keyFileJson1 = readFileSync("./test_sign/wallet/user1.json", {
  encoding: "utf8",
}).trim();
const keyFileObject1 = JSON.parse(keyFileJson1);

const signer1 = UserSigner.fromWallet(keyFileObject1, process.env.KEY1);
const userAccount1 = new Account(signer1.getAddress());

const setUpContract = async () => {
  //Set Up ABI
  let jsonContent = await promises.readFile(
    "./test_sign/output/test_sign.abi.json",
    {
      encoding: "utf8",
    }
  );
  let json = JSON.parse(jsonContent);
  let abiRegistry = AbiRegistry.create(json);
  let abi = new SmartContractAbi(abiRegistry, ["TestSign"]);

  //Fetch And Update Account
  let fetchedUserAccount1 = await proxyProvider.getAccount(
    signer1.getAddress()
  );

  userAccount1.update(fetchedUserAccount1);

  //Set Contract
  const contract = new SmartContract({
    address: new Address(
      "erd1qqqqqqqqqqqqqpgqacpca334ltmsm8gc78upv03xl7l3ma5m42yqzdm9js"
    ),
    abi: abi,
  });

  return contract;
};

const testAgreement = async (contract, signer, sender, data, signature) => {
  let transactionTestAgreement = contract.call({
    func: new ContractFunction("test_agreement"),
    gasLimit: 9063500,
    args: [
      new BytesValue(data),
      new ArrayVec(
        new ArrayVecType(64, new U8Type()),
        formatHexToU8(signature)
      ),
    ],
    chainID: "D",
  });

  transactionTestAgreement.setNonce(sender.getNonceThenIncrement());

  await signer.sign(transactionTestAgreement);
  const txHash = await proxyProvider.sendTransaction(transactionTestAgreement);
  console.log("Transaction Hash for Test", txHash);
};

const doTestAgreement = async () => {
  const data =
    "1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8";
  const signature =
    "85005ca1e56035526f02d2d64228fdaaeda4c93eea700f5aa6ac3f11952fa8a8423d01eb1b1a8747295a3188288be8326f267ebf5ce9f2feebc84df36654340d";
  const caller =
    "erd1cgcvwt6sjsdrd5ug6kmafnk6t86mk9vdgxac7tp8lhazxdsesqyqwtqlvn";
  await testAgreement(
    await setUpContract(),
    signer1,
    userAccount1,
    data,
    signature
  );
};
doTestAgreement();
