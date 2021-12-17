/**
 * FIO SDK example of voteproxy
 * API details: https://developers.fioprotocol.io/pages/api/fio-api/#options-voteproxy
 */
const { FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  proxy = '',     // The FIO Crypto Handle of the registered proxy
  fio_address = '',  // The FIO Crypto Handle of the account that is proxying their vote
  max_fee = 100000000000


const voteproxy = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'voteproxy',
      account: 'eosio',
      data: {
        proxy: proxy,
        fio_address: fio_address,
        max_fee: max_fee
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

voteproxy();