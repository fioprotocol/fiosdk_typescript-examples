/**
 * fio.serialize-sign.js 
 * 
 * Demonstrates how to use the FIO Javascript SDK to enable offline signing of transactions.
 * 
 * It first creates a serialized transaction without requiring any FIO keys. It then passes 
 * the serialized transaction to the sign method to generate the signature. 
 */
const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const createHash = require('create-hash');
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payeeKey = '',  // FIO Public Key of the payee
  amount = 1000000000,
  max_fee = 100000000000


const main = async () => {

    user = new FIOSDK(
        '',
        '',
        baseUrl,
        fetchJson
    )

    const chainData = await user.transactions.getChainDataForTx();
    console.log('ChainData: ', chainData);

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

    const { serializedContextFreeData, serializedTransaction } = await user.transactions.serialize({
        chainId: chainData.chain_id,
        transaction,
    });
    
    // Pre-compute transaction ID
    const txnId = createHash('sha256').update(serializedTransaction).digest().toString('hex')
    console.log('Pre-compute transaction ID: ', txnId);


    const signedTransaction = await user.transactions.sign({
        chainId: chainData.chain_id,
        privateKeys: [privateKey],
        transaction,
        serializedTransaction,
        serializedContextFreeData,
    });
    console.log('signedTransaction: ', signedTransaction);

    const result = await user.executePreparedTrx('transfer_tokens_pub_key', signedTransaction);
    console.log(result);
}

main();