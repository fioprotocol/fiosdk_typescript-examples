/**
 * Adds a new permission to an account. In this example it adds a "regaddress" permission to the account.
 * This permission can then be linked to a contract action (see eosio-linkauth.js) to enable a secondary 
 * account to execute actions on the primary accounts behalf.
 * 
 * This script only uses the fiojs library.
 */

const { Fio } = require('@fioprotocol/fiojs');
fetch = require('node-fetch');
const properties = require('./properties.js');

const privateKey = properties.privateKey,
  account = properties.account,
  permissionName = 'regaddress',
  parent = 'active',
  registrarAccount = '',  // The account that will register addresses on behalf of the domain owner
  permission = 'active',
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
        permission: 'active',
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
        "account": account,
        "permission": permissionName,
        "parent": parent,
        "auth": {
          "threshold": 1,
          "keys": [],
          "waits": [],
          "accounts": [{
            "permission": {
              "actor": registrarAccount,
              "permission": permission
            },
            "weight": 1
          }
          ]
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