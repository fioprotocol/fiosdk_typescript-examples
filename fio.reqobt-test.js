const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payerAddress = 'ebtest1@fiotestnet',
  payeeAddress = 'eric04@fiotestnet',
  amount = 1000000000,
  chainCode = 'FIO',
  tokenCode = 'FIO',
  memo = 'Request from eric04'
  max_fee = 100000000000


const newfundsreq = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    user.setSignedTrxReturnOption(true);
    preparedTrx = await user.genericAction('requestFunds', {
      payerFioAddress: payerAddress,
      payeeFioAddress: payeeAddress,
      payeePublicAddress: publicKey,
      amount: amount,
      chainCode: chainCode,
      tokenCode: tokenCode,
      memo: memo,
      maxFee: max_fee,
    });

    console.log('Result: ', preparedTrx);

  } catch (err) {
    console.log('Error preparedTrx: ', err);
    console.log('Json error==> : ', JSON.stringify(err.json.fields));
  }

  try {
    // const result = await user.executePreparedTrx(EndPoint.newFundsRequest, preparedTrx)
    const result = await user.executePreparedTrx('new_funds_request', preparedTrx);
    console.log('transaction_id: ', result.transaction_id);
    expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected', 'block_num', 'transaction_id');
    user.setSignedTrxReturnOption(false);
  } catch (err) {
    console.log('Error transaction_id: ', err);
    console.log('Json error==> : ', JSON.stringify(err));
  }
};

newfundsreq();