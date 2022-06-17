/**
 * 
 * fio.serialize-offline-sign.js 
 * 
 * Demonstrates how to use the FIO Javascript SDK to enable offline signing of transactions.
 * This example executes a trnsfiopubky action.
 * 
 * It first creates a serialized transaction without requiring any FIO private keys. 
 * It then passes the serialized transaction to the sign method to generate the signature offline.
 * Finally, it passes the signed transaction to the execute method to send to the chain.
 * 
 */

const fixedAccount = "fio.token";
const fixedAction = "trnsfiopubky";
const fixedEndpoint = "transfer_tokens_pub_key";

const accountInfo = {
  publicKey: "",
  privateKey: "",
  actor: "",
};

const Url = 'https://fiotestnet.greymass.com/v1/';


const serialize = async () => {
  const {FIOSDK } = require('@fioprotocol/fiosdk');
  fetch = require('node-fetch');

  const fetchJson = async (uri, opts = {}) => {
    return fetch(uri, opts)
  };

  const baseUrl = Url;

  const data = {
    payee_public_key: '',  // FIO Public Key of the payee
    amount: 1000000000,
    max_fee: 100000000000,
    tpid: '',
  };

  user = new FIOSDK(
      '',
      '',
      baseUrl,
      fetchJson
  )

  const chainData = await user.transactions.getChainDataForTx();
  //console.log('ChainData: ', chainData);

  const transaction = await user.transactions.createRawTransaction({
      action: fixedAction,
      account: fixedAccount,
      data: data,
      publicKey: accountInfo.publicKey,
      chainData,
  });
  //console.log('Transaction: ', transaction);

  const { serializedContextFreeData, serializedTransaction } = await user.transactions.serialize({
      chainId: chainData.chain_id,
      transaction,
  });
  //console.log('serializedTransaction: ', serializedTransaction);

  return { transaction, serializedTransaction, serializedContextFreeData, 'chainID': chainData.chain_id };
}


const sign = async (txnData) => {
  const { Transactions } = require('@fioprotocol/fiosdk/lib/transactions/Transactions');

  const abiMap = new Map();
  abiMap.set(fixedAccount, {
    account_name: fixedAccount,
    code_hash:
      "894a23edc27760fc2ce66932aad8edfde0b4593b935d22adcbdf21c0b9d2685e",
    abi_hash:
      "d579d0f4fd42fea94be5f8bf202c18dbec89feff89bb8b7d26df289fdc2ad83f",
    abi: "DmVvc2lvOjphYmkvMS4xAAoHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQGY3JlYXRlAAEObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcMbG9ja3BlcmlvZHYyAAIIZHVyYXRpb24FaW50NjQGYW1vdW50BWludDY0B21pbnRmaW8AAgJ0bwRuYW1lBmFtb3VudAZ1aW50NjQGcmV0aXJlAAMIcXVhbnRpdHkFaW50NjQEbWVtbwZzdHJpbmcFYWN0b3IEbmFtZQh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nDHRybnNmaW9wdWJreQAFEHBheWVlX3B1YmxpY19rZXkGc3RyaW5nBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcLdHJuc2xvY3Rva3MABxBwYXllZV9wdWJsaWNfa2V5BnN0cmluZwhjYW5fdm90ZQVpbnQzMgdwZXJpb2RzDmxvY2twZXJpb2R2MltdBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcHAAAAAKhs1EUGY3JlYXRlAAAAAAAApTF2BWlzc3VlAAAAAIC6laeTB21pbnRmaW8AAAAAAKjrsroGcmV0aXJlAAAAAFctPM3NCHRyYW5zZmVyAODh0ZW6hefNDHRybnNmaW9wdWJreQAAMKQZ0YjnzQt0cm5zbG9jdG9rcwACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA===",
  });

  let transactions = new Transactions;

  const signedTransaction = await transactions.sign({
    abiMap,
    chainId: txnData.chainID,
    privateKeys: [accountInfo.privateKey],
    transaction: txnData.transaction,
    serializedTransaction: txnData.serializedTransaction,
    serializedContextFreeData: txnData.serializedContextFreeData,
  });
  //console.log('signedTransaction: ', signedTransaction)

  return signedTransaction;
}


const execute = async (signedTransaction) => {
  const {FIOSDK } = require('@fioprotocol/fiosdk');
  fetch = require('node-fetch');

  const baseUrl = Url;

  const fetchJson = async (uri, opts = {}) => {
    return fetch(uri, opts)
  };

  user = new FIOSDK(
      '',
      '',
      baseUrl,
      fetchJson
  )

  const result = await user.executePreparedTrx(fixedEndpoint, signedTransaction);
  console.log(result);
}


serialize().then(ret => {
  return sign(ret);
})
.then(ret => {
  execute(ret);
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});
