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


const trnsfiopubky = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('transferTokens', {
      payeeFioPublicKey: payeeKey,
      amount: amount,
      maxFee: max_fee
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err);
    console.log('Details: ', err.json)
  }
}

trnsfiopubky();