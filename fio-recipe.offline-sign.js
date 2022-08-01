/**
 * Example code for executing offline signing
 */

const { Fio } = require("@fioprotocol/fiojs");
const { Transactions } = require("@fioprotocol/fiosdk/lib/transactions/Transactions");

const fixedAccount = "fio.token";
const fixedAction = "trnsfiopubky";
const toAddress = "";
const accountInfo = {
  publicKey: "",
  privateKey: "",
};

// Need to get latest chainData before signing
const chainData = {
  chain_id: "b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e",
  expiration: "2022-06-22T20:12:11.088",
  ref_block_num: 55477 & 0xffff,
  ref_block_prefix: 1922445087,
};

const fioTokenAbi = {
  account_name: "fio.token",
  code_hash: "894a23edc27760fc2ce66932aad8edfde0b4593b935d22adcbdf21c0b9d2685e",
  abi_hash: "d579d0f4fd42fea94be5f8bf202c18dbec89feff89bb8b7d26df289fdc2ad83f",
  abi: "DmVvc2lvOjphYmkvMS4xAAoHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQGY3JlYXRlAAEObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcMbG9ja3BlcmlvZHYyAAIIZHVyYXRpb24FaW50NjQGYW1vdW50BWludDY0B21pbnRmaW8AAgJ0bwRuYW1lBmFtb3VudAZ1aW50NjQGcmV0aXJlAAMIcXVhbnRpdHkFaW50NjQEbWVtbwZzdHJpbmcFYWN0b3IEbmFtZQh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nDHRybnNmaW9wdWJreQAFEHBheWVlX3B1YmxpY19rZXkGc3RyaW5nBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcLdHJuc2xvY3Rva3MABxBwYXllZV9wdWJsaWNfa2V5BnN0cmluZwhjYW5fdm90ZQVpbnQzMgdwZXJpb2RzDmxvY2twZXJpb2R2MltdBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcHAAAAAKhs1EUGY3JlYXRlAAAAAAAApTF2BWlzc3VlAAAAAIC6laeTB21pbnRmaW8AAAAAAKjrsroGcmV0aXJlAAAAAFctPM3NCHRyYW5zZmVyAODh0ZW6hefNDHRybnNmaW9wdWJreQAAMKQZ0YjnzQt0cm5zbG9jdG9rcwACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA===",
};

async function main() {
  Transactions.FioProvider = {
    accountHash: Fio.accountHash,
  };
  Transactions.abiMap.set(fioTokenAbi.account_name, fioTokenAbi);

  const transactions = new Transactions();
  const rawTransaction = await transactions.createRawTransaction({
    action: fixedAction,
    account: fixedAccount,
    data: {
      payee_public_key: toAddress,
      tpid: "",
      amount: 1000000000,
      max_fee: 100000000000,
    },
    publicKey: accountInfo.publicKey,
    chainData: chainData,
  });

  const { serializedContextFreeData, serializedTransaction } =
    await transactions.serialize({
      chainId: chainData.chain_id,
      transaction: rawTransaction,
    });

  const signedTransaction = await transactions.sign({
    chainId: chainData.chain_id,
    privateKeys: [accountInfo.privateKey],
    transaction: rawTransaction,
    serializedContextFreeData: serializedContextFreeData,
    serializedTransaction,
  });

  return signedTransaction;
}

main()
  .then((ret) => {
    console.log(JSON.stringify(ret));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
