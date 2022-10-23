require('dotenv').config();
const {
  ProxyNetworkProvider,
} = require('@elrondnetwork/erdjs-network-providers');
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
} = require('@elrondnetwork/erdjs');
const { UserSigner } = require('@elrondnetwork/erdjs-walletcore');
const { BigNumber } = require('bignumber.js');
const { promises, fs, readFileSync } = require('fs');

const { generateTree } = require('@checkerchain/elrond-merkle-tree-generator');
const { formatHexToU8, formProofs } = require('./utils');

const proxyProvider = new ProxyNetworkProvider('https://devnet-api.elrond.com');

//User 1
const keyFileJson1 = readFileSync('./wallet/user1.json', {
  encoding: 'utf8',
}).trim();
const keyFileObject1 = JSON.parse(keyFileJson1);

const signer1 = UserSigner.fromWallet(keyFileObject1, process.env.KEY1);
const userAccount1 = new Account(signer1.getAddress());

const setUpContract = async () => {
  //Set Up ABI
  let jsonContent = await promises.readFile(
    './test-sign/output/test-sign.abi.json',
    {
      encoding: 'utf8',
    }
  );
  let json = JSON.parse(jsonContent);
  let abiRegistry = AbiRegistry.create(json);
  let abi = new SmartContractAbi(abiRegistry, ['SoulboundNFTReputation']);

  //Fetch And Update Account
  let fetchedUserAccount1 = await proxyProvider.getAccount(
    signer1.getAddress()
  );

  userAccount1.update(fetchedUserAccount1);

  //Set Airdrop Contract
  const contract = new SmartContract({
    address: new Address(airdropContract),
    abi: abi,
  });

  return contract;
};

const testAgreement = async (contract, signer, sender, data, signature) => {
  let transactionTestAgreement = contract.call({
    func: new ContractFunction('test_agreement'),
    gasLimit: 9063500,
    args: [
      new BytesValue(data),
      new ArrayVec(
        new ArrayVecType(64, new U8Type()),
        formatHexToU8(signature)
      ),
    ],
    chainID: 'D',
  });

  transactionTestAgreement.setNonce(sender.getNonceThenIncrement());

  await signer.sign(transactionTestAgreement);
  const txHash = await proxyProvider.sendTransaction(transactionTestAgreement);
  console.log('Transaction Hash for Test', txHash);
};

const doTestAgreement = async () => {
  const data = '';
  const signature = '';
  const caller =
    'erd1cgcvwt6sjsdrd5ug6kmafnk6t86mk9vdgxac7tp8lhazxdsesqyqwtqlvn';
  await testAgreement(
    await setUpContract(),
    signer1,
    userAccount1,
    data,
    signature
  );
};
doTestAgreement();
