const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
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
        privateKey,
        publicKey,
        baseUrl,
        fetchJson
    )

    const chainData = await user.transactions.getChainDataForTx();
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

    const signedTransaction = await user.transactions.sign({
        chainId: chainData.chain_id,
        privateKeys: [privateKey],
        transaction,
        serializedTransaction,
        serializedContextFreeData,
    });

    const result = await user.executePreparedTrx('transfer_tokens_pub_key', signedTransaction);
    console.log(result);
}

main();