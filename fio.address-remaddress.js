const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  fio_address = '',
  chain_code = '',
  token_code = '',
  public_address = '',
  max_fee = 1000000000

const remaddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'remaddress',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        public_addresses: [
          {
            chain_code: chain_code,
            token_code: token_code,
            public_address: public_address,
          }
        ],
        max_fee: max_fee,
        tpid: ''
  
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

remaddress();