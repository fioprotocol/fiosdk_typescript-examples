const { FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payeeAddress = '',    // FIO Crypto Handle for the user making the request
  payerPubKey = '',     // FIO Public Key for the user paying the funds
  payerAddress = '',    // FIO Crypto Handle for the user paying the funds
  chainCode = '',       // Chain code of crypto (e.g., ETH)
  tokenCode = '',       // Chain code of crypto (e.g., USDT)
  tokenAddress = '',    // Blockchain public address where the funds will be sent
  amount = 5,           // Amount in FIO
  requestMemo = '',     // Optional memo
  maxFee = 100000000000


const newfundsreq = async () => {

  payee = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await payee.genericAction('requestFunds', {
      payerFioAddress: payerAddress,
      payeeFioAddress: payeeAddress,
      payeeTokenPublicAddress: tokenAddress,
      amount: amount,
      chainCode: chainCode,
      tokenCode: tokenCode,
      memo: requestMemo,
      maxFee: maxFee,
      payerFioPublicKey: payerPubKey,
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

newfundsreq();