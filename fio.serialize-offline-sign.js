/**
 * 
 * DRAFT - NOT WORKING
 * 
 * fio.serialize-offline-sign.js 
 * 
 * Demonstrates how to use the FIO Javascript SDK to enable offline signing of transactions.
 * 
 * It first creates a serialized transaction without requiring any FIO keys. It then passes 
 * the serialized transaction to the sign method to generate the signature. 
 */
const properties = require('./properties.js')

async function timeout(ms) {
    await new Promise(resolve => {
      setTimeout(resolve, ms)
    })
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payeeKey = '',  // FIO Public Key of the payee
  amount = 1000000000,
  max_fee = 100000000000


const serialize = async () => {

    const {FIOSDK } = require('@fioprotocol/fiosdk')
    fetch = require('node-fetch')
    const createHash = require('create-hash');

    const fetchJson = async (uri, opts = {}) => {
      return fetch(uri, opts)
    }

    user = new FIOSDK(
        privateKey,
        publicKey,
        baseUrl,
        fetchJson
    )

    const chainData = await user.transactions.getChainDataForTx();
    //console.log('ChainData: ', chainData);

    const transaction = await user.transactions.createRawTransaction({
        action: 'trnsfiopubky',
        account: 'fio.token',
        data: {
            payee_public_key: payeeKey,
            amount: amount,
            max_fee: max_fee,
            tpid: ''
        },
        publicKey,
        chainData,
    });
    //console.log('raw: ', JSON.stringify(transaction))

    const { serializedContextFreeData, serializedTransaction } = await user.transactions.serialize({
        chainId: chainData.chain_id,
        transaction,
    });
    console.log('chainid: ', chainData.chain_id)
    
  
    // Pre-compute transaction ID
    const txnId = createHash('sha256').update(serializedTransaction).digest().toString('hex')
    //console.log('Pre-compute transaction ID: ', txnId);

    return { transaction, serializedTransaction, serializedContextFreeData, 'chainID': chainData.chain_id };
}

const sign = async (transaction, serializedTransaction, serializedContextFreeData, chainId) => {

  const { Transactions } = require('@fioprotocol/fiosdk/lib/transactions/Transactions')

    setTimeout(function() {
        console.log('Wait')
    }, 1000);

    let transactions2 = new Transactions;

     const signedTransaction = await transactions2.sign({
        //abiMap,
        chainId,
        privateKeys: [privateKey],
        transaction,
        serializedTransaction,
        serializedContextFreeData,
    });
    console.log('transaction: ', transaction)
    console.log('serializedTransaction: ', serializedTransaction)
    console.log('serializedContextFreeData: ', serializedContextFreeData)

    return signedTransaction;
}


const signOffline = async () => {
  const { Transactions } = require('@fioprotocol/fiosdk/lib/transactions/Transactions')
  const httpEndpoint = 'http://testnet.fioprotocol.io'

  //To get the Raw ABI:
  //fetch = require('node-fetch')
  //tokenRawAbi = await (await fetch(baseUrl + 'chain/get_raw_abi', {body: `{"account_name": "fio.token"}`, method: 'POST'})).json()

  const tokenRawAbi = {
    account_name: 'fio.token',
    code_hash: '894a23edc27760fc2ce66932aad8edfde0b4593b935d22adcbdf21c0b9d2685e',
    abi_hash: 'd579d0f4fd42fea94be5f8bf202c18dbec89feff89bb8b7d26df289fdc2ad83f',
    abi: 'DmVvc2lvOjphYmkvMS4xAAoHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQGY3JlYXRlAAEObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcMbG9ja3BlcmlvZHYyAAIIZHVyYXRpb24FaW50NjQGYW1vdW50BWludDY0B21pbnRmaW8AAgJ0bwRuYW1lBmFtb3VudAZ1aW50NjQGcmV0aXJlAAMIcXVhbnRpdHkFaW50NjQEbWVtbwZzdHJpbmcFYWN0b3IEbmFtZQh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nDHRybnNmaW9wdWJreQAFEHBheWVlX3B1YmxpY19rZXkGc3RyaW5nBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcLdHJuc2xvY3Rva3MABxBwYXllZV9wdWJsaWNfa2V5BnN0cmluZwhjYW5fdm90ZQVpbnQzMgdwZXJpb2RzDmxvY2twZXJpb2R2MltdBmFtb3VudAVpbnQ2NAdtYXhfZmVlBWludDY0BWFjdG9yBG5hbWUEdHBpZAZzdHJpbmcHAAAAAKhs1EUGY3JlYXRlAAAAAAAApTF2BWlzc3VlAAAAAIC6laeTB21pbnRmaW8AAAAAAKjrsroGcmV0aXJlAAAAAFctPM3NCHRyYW5zZmVyAODh0ZW6hefNDHRybnNmaW9wdWJreQAAMKQZ0YjnzQt0cm5zbG9jdG9rcwACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA==='
  }

  abiMap = new Map()
  abiMap.set('fio.token', tokenRawAbi)

  let txn = {
    expiration: '2022-05-24T20:47:17.500',
    ref_block_num: 40444,
    ref_block_prefix: 3796546640,
    max_net_usage_words: 0,
    max_cpu_usage_ms: 0,
    delay_sec: 0,
    context_free_actions: [],
    actions: [
      {
        account: 'fio.token',
        name: 'trnsfiopubky',
        authorization: [Array],
        data: [Object]
      }
    ],
    transaction_extensions: []
  }

  let serializedTransaction = [
      77,  71, 141,  98, 240, 163,  39,  36, 141,  89,   0,   0,
        0,   0,   1,   0,   0, 152,  10, 210,  12, 168,  91, 224,
      225, 209, 149, 186, 133, 231, 205,   1,  16, 219,  70, 167,
      162, 252,  44, 205,   0,   0,   0,   0, 168, 237,  50,  50,
      79,  53,  70,  73,  79,  56,  65, 107,  70,  71,  53, 107,
      103, 118, 105,  77,  66,  82, 109,  89, 103,  76, 101, 109,
      122,  97, 117, 104, 116, 119,  74, 122, 116,  84,  67,  98,
      119,  87,  67,  53, 109,  70,  99,  82,  80,  49, 112,  82,
      70,  53,  50,  54,  49, 116, 113,   0, 202, 154,  59,   0,
        0,   0,   0,   0, 232, 118,  72,  23,   0,   0,   0,  16,
      219,  70, 167, 162, 252,  44, 205,   0,   0
  ]

  let transactions = new Transactions;

  const signedTransaction = await transactions.sign({
    abiMap,
    chainId: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
    privateKeys: [privateKey],
    transaction: txn,
    serializedTransaction: serializedTransaction,
    serializedContextFreeData: null,
  });

  console.log('signedtxn:', signedTransaction)

  return signedTransaction;
}


const execute = async (signedTransaction) => {

    user = new FIOSDK(
        '',
        '',
        baseUrl,
        fetchJson
    )

    const result = await user.executePreparedTrx('transfer_tokens_pub_key', signedTransaction);
    console.log(result);
}

signOffline();
/*

serialize().then(result => {
    //return sign(result.transaction, result.serializedTransaction, result.serializedContextFreeData, result.chainID);
    return sign(result.transaction, result.serializedTransaction, result.serializedContextFreeData, result.chainID);
}).then(result => {
    console.log('signedTransaction: ', result)
    //execute(result);
});
*/