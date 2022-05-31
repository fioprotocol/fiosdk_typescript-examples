const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  fio_domain = '',
  chain_code = '',
  public_address = '',   // Address on Ethereum or Polygon
  max_oracle_fee = 600000000000,
  max_fee = 100000000000,
  tpid = ''


const wrapdomain = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'wrapdomain',
      account: 'fio.oracle',
      data: {
        fio_domain: fio_domain,
        chain_code: chain_code,
        public_address: public_address,
        max_oracle_fee: max_oracle_fee,
        max_fee: max_fee,
        tpid: tpid
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json.error)
  }
}

wrapdomain();