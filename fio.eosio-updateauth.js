/**
 * DRAFT
 * 
 * FIO SDK example of updateauth
 * API details: https://developers.eos.io/manuals/eosjs/v22.0/how-to-guides/how-to-create-permissions
 * 
 * The example creates a new account permission called register_my_addresses and assignes this permission to a
 * separate account. 
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
  account = properties.account,
  permission_name = 'register_my_addresses',  // The name of the new permission. We are going to eventually link this to the "addaddress" contract action.
  partner_account = 'accountname',            // The account that will be able to execute with active permission on behalf of the main account
  max_fee = 100000000000


const updateauth = async () => {

  const user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  const authorization_object = { 
    threshold: 1, 
    accounts: [ 
      {
        permission: {
          actor: partner_account, 
          permission: 'active', 
        },
        weight: 1
      }
    ],
    keys: [],
    waits: [],
  };

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'updateauth',
      account: 'eosio',
      data: {
        account: account,
        permission: permission_name,
        parent: 'active',
        auth: authorization_object,
        max_fee: max_fee
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

updateauth();