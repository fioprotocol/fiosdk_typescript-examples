/**
 * Gives a second account 'active' permissions on an existing account. 
 * 
 * This script only uses the fiojs library.
 */

const { Fio } = require('@fioprotocol/fiojs');
fetch = require('node-fetch');
const properties = require('./properties.js');

const privateKey = properties.privateKey,
  account = properties.account,   // The original account. In this example we keep the existing account permissions.
  permissionName = 'owner',  // The permission being updated (e.g. 'active' or 'owner')
  parent = '',     // Parent of the permission (e.g. 'active' or 'owner'. Use '' when updating the owner permission.)
  additionalAccount = '',      // The second account you are giving permissions to
  permission = 'active',  // The permission you are linking to the above permissionName
  newKey = ''
  max_fee = 1000000000000

const baseUrl = properties.server + '/v1/';
const fiourl = baseUrl + 'chain/';

const callFioApiSigned = async (endPoint, txn) => {
  const info = await (await fetch(fiourl + 'get_info')).json();
  const blockInfo = await (await fetch(fiourl + 'get_block', { body: `{"block_num_or_id": ${info.last_irreversible_block_num}}`, method: 'POST' })).json()
  const chainId = info.chain_id;
  const currentDate = new Date();
  const timePlusTen = currentDate.getTime() + 10000;
  const timeInISOString = (new Date(timePlusTen)).toISOString();
  const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  const transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: txn.account,
      name: txn.action,
      authorization: [{
        actor: txn.actor,
        permission: 'owner',
      }],
      data: txn.data,
    }]
  };

  const abiMap = new Map()
  const tokenRawAbi = await (await fetch(fiourl + 'get_raw_abi', { body: '{"account_name": "' + txn.account + '"}', method: 'POST' })).json()
  abiMap.set(txn.account, tokenRawAbi)

  var privateKeys = [txn.privKey];

  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  const pushResult = await fetch(fiourl + endPoint, {
    body: JSON.stringify(tx),
    method: 'POST',
  });

  const json = await pushResult.json()
  return json;
};


const updateauth = async () => {

  try {

    const result = await callFioApiSigned('push_transaction', {
      action: 'updateauth',
      account: 'eosio',
      actor: account,
      privKey: privateKey,
      data: {
        "account": account,             // The account that will own the permission
        "permission": permissionName,   // Name of the permission you are updating
        "parent": parent,               // Parent of the permission (e.g. 'active')
        "auth": {
          "threshold": 1,
          "keys": [
            {
              "key": newKey,
              "weight": 1
            }
          ],
          "waits": [],
          "accounts": []
        },
        "max_fee": max_fee
      }
    })

    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err.json)
  }
}

updateauth();