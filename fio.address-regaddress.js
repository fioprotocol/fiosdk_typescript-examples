const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

const privateKey = '',
  publicKey = '',
  fio_address = '',
  owner_fio_public_key = publicKey,
  max_fee = 100000000000


const regaddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'regaddress',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        owner_fio_public_key: owner_fio_public_key,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

regaddress();