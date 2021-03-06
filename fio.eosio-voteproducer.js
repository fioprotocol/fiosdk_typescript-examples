/**
 * FIO SDK example of voteproducer
 * API details: https://developers.fioprotocol.io/pages/api/fio-api/#options-voteproducer
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
  producers = ['blockpane@fiotestnet'],  // Comma separated list of producers
  fio_address = '',  // FIO Crypto Handle of the voter
  max_fee = 100000000000


const voteproducer = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'voteproducer',
      account: 'eosio',
      data: {
        producers: producers,
        fio_address: fio_address,
        max_fee: max_fee
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

voteproducer();