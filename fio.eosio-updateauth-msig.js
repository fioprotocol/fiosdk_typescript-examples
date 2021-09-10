const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  account = 'co5lxeydcgje',  // The account where you are updating permissions
  permissionName = 'active',
  parent = 'owner',
  threshold = 2,
  // actor names must be in alphabetical order
  actor1 = '1jynjfoswglg',
  actor1Permission = 'active',
  actor2 = 'qhdo4r2pltdr',
  actor2Permission = 'active',   
  actor3 = 'tsksksw1jxrb',
  actor3Permission = 'active',
  max_fee = 1000000000000


const updateauth = async () => {

  user = new FIOSDK(
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
        account: account,
        permission: permissionName,
        parent: parent,
        auth: {
          threshold: threshold,
          keys: [],
          waits: [],
          accounts: [
            {
              permission: {
                actor: actor1,
                permission: actor1Permission
              },
              weight: 1
            },
            {
              permission: {
                actor: actor2,
                permission: actor2Permission
              },
              weight: 1
            },
            {
              permission: {
                actor: actor3,
                permission: actor3Permission
              },
              weight: 1
            }
          ]
        },
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json.error)
  }
}

updateauth();