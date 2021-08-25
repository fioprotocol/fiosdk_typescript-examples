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
  isPublic = 0,  // 1 = public, 0 = private
  max_fee = 1000000000000


const setdomainpublic = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'setdomainpub',
      account: 'fio.address',
      data: {
        fio_domain: fio_domain,
        is_public: isPublic,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

setdomainpublic();