const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey

const burnaddress = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson

  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'burnaddress',
      account: 'fio.address',
      data: {
        fio_address: "",
        max_fee: 40000000000,
        tpid: "",
        actor: properties.account
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log(err.json)
  }
}

burnaddress();