const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  amount = 200000000000,            // SUFs
  chain_code = 'ETH',
  public_address = '0xe28FF0D44d533d15cD1f811f4DE8e6b1549945c9',            // ETH address
  max_oracle_fee = 600000000000,
  max_fee = 10000000000


const wraptokens = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'wraptokens',
      account: 'fio.oracle',
      data: {
        amount: amount,
        chain_code: chain_code,
        public_address: public_address,
        max_oracle_fee: max_oracle_fee,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

wraptokens();