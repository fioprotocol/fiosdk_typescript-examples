/**
 * FIO SDK example of linkauth
 * EOSIO API details: https://developers.eos.io/manuals/eosjs/v22.0/how-to-guides/how-to-link-permissions
 * 
 * To link an existing permission, submit a transaction to the linkauth action of the eosio account.
 * 
 * In the example shown below links the permission 'regmyadd' to the addaddress contract action
 * contract_action action.
 */
const { Fio } = require('@fioprotocol/fiojs');
const { TextEncoder, TextDecoder } = require('text-encoding');
const fetch = require('node-fetch');
const properties = require('./properties.js')

const httpEndpoint = properties.server

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  account = properties.account,
  maxFee = 100000000000

const fiojsLinkauth = async () => {
  info = await (await fetch(httpEndpoint + '/v1/chain/get_info')).json();
  blockInfo = await (await fetch(httpEndpoint + '/v1/chain/get_block', {body: `{"block_num_or_id": ${info.last_irreversible_block_num}}`, method: 'POST'})).json()
  chainId = info.chain_id;
  currentDate = new Date();
  timePlusTen = currentDate.getTime() + 10000;
  timeInISOString = (new Date(timePlusTen)).toISOString();
  expiration = timeInISOString.substr(0, timeInISOString.length - 1);

  transaction = {
    expiration,
    ref_block_num: blockInfo.block_num & 0xffff,
    ref_block_prefix: blockInfo.ref_block_prefix,
    actions: [{
      account: 'eosio',
      name: 'linkauth',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        account: account,                       // the owner of the permission to be linked, this account will sign the transaction
        code: 'fio.address',                    // the contract owner of the action to be linked
        type: 'addaddress',                     // the action to be linked
        requirement: 'regmyadd',            // the name of the custom permission (created by updateauth)
        max_fee: maxFee
      }
    }]
  };

  abiMap = new Map()
  tokenRawAbi = await (await fetch(httpEndpoint + '/v1/chain/get_raw_abi', {body: `{"account_name": "eosio"}`, method: 'POST'})).json()
  abiMap.set('eosio', tokenRawAbi)
 
  var privateKeys = [privateKey];
  
  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  pushResult = await fetch(httpEndpoint + '/v1/chain/push_transaction', {
      body: JSON.stringify(tx),
      method: 'POST',
  });
  
  json = await pushResult.json();

  if (json.type) {
    console.log('Error: ', json.fields[0].error);
  } else {
    console.log('Success. Transaction ID: ', json.transaction_id)
  }
   
};

fiojsLinkauth();

