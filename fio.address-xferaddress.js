const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  fio_address = '',     // The address that will be transferred
  new_owner_fio_public_key = '',   // The public key of the new owner
  max_fee = 100000000000


const xferaddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'xferaddress',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        new_owner_fio_public_key: new_owner_fio_public_key,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

xferaddress();