const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

const privateKey = ''
  publicKey = '',
  fio_address = '',
  max_fee = 100000000000

const remallnfts = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'remallnfts',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json.error)
  }
}

remallnfts();