/**
 * This example demonstrates the use of executePreparedTrx. Using executePreparedTrx enables
 * you to separate the creation of the transaction from the submitting the transaction. This provides
 * several benefits including:
 *   - Enabling the resending of transactions in case of failure (if a transaction is submitted twice the 
 *       second transaction will be flagged as a duplicate)
 *   - Retrieving the transaction ID prior to submitting the transaction
 */

const { FIOSDK } = require('@fioprotocol/fiosdk');
fetch = require('node-fetch');
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
};

const baseUrl = 'http://testnet.fioprotocol.io' + '/v1/';

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payeeKey = '',  // FIO Public Key of the payee
  amount = 1000000000,
  max_fee = 800 * FIOSDK.SUFUnit;


const transferFioPreparedTxn = async () => {

  const user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  );

  let preparedTrx;

  try {
    user.setSignedTrxReturnOption(true);
    preparedTrx = await user.genericAction('pushTransaction', {
      action: 'trnsfiopubky',
      account: 'fio.token',
      data: {
        payee_public_key: payeeKey,
        amount: amount,
        max_fee: max_fee,
        tpid: ''
      }
    });
    console.log('Prepared transaction: ', preparedTrx);
  } catch (err) {
    console.log('Error preparedTrx: ', err);
    console.log('Json error==> : ', JSON.stringify(err.json.fields));
  }

  try {
    const result = await user.executePreparedTrx('transfer_tokens_pub_key', preparedTrx);
    console.log('Executed transaction: ', result);
    user.setSignedTrxReturnOption(false);
  } catch (err) {
    console.log('Error transaction_id: ', err);
    console.log('Json error==> : ', JSON.stringify(err));
  }

};

transferFioPreparedTxn();