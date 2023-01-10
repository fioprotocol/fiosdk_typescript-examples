const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const burnnfts = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    let done = false;
    while (!done) {
      const result = await user.genericAction('pushTransaction', {
        action: 'burnnfts',
        account: 'fio.address',
        data: {
          actor: properties.account
        }
      })
      console.log('Result: ', result);
      if (result.status != 'OK') {done = true;}
      await delay(2000);
    }
    
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

burnnfts();