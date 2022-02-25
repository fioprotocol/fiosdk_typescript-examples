/**
 * DRAFT
 * 
 * FIO SDK example of linkauth
 * EOSIO API details: https://developers.eos.io/manuals/eosjs/v22.0/how-to-guides/how-to-link-permissions
 * 
 * To link an existing permission, submit a transaction to the linkauth action of the eosio account.
 * 
 * In the example shown below useraaaaaaaa links the permission action_perm to the contract useraaaaaaaa's 
 * contract_action action.
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
  account = properties.account

const linkauth = async () => {

  const user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'updateauth',
      account: 'eosio',
      data: {
        account: account,                // the owner of the permission to be linked, this account will sign the transaction
        code: 'fio.address',                    // the contract owner of the action to be linked
        type: 'addaddress',                     // the action to be linked
        requirement: 'register_my_addresses',   // the name of the custom permission (created by updateauth)
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

linkauth();