const { Fio } = require('@fioprotocol/fiojs');
const { TextEncoder, TextDecoder } = require('text-encoding');
const fetch = require('node-fetch');
const properties = require('./properties.js')

const httpEndpoint = properties.server

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  account = properties.account,
  address = 'purse@alice',  // The address you want to register
  maxFee = 100000000000

const fiojsRegaddress = async () => {
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
      account: 'fio.address',
      name: 'regaddress',
      authorization: [{
        actor: account,
        permission: 'active',
      }],
      data: {
        fio_address: address,
        owner_fio_public_key: publicKey,
        max_fee: maxFee,
        tpid: 'rewards@wallet',
        actor: account,
      },
    }]
  };

  abiMap = new Map()
  tokenRawAbi = await (await fetch(httpEndpoint + '/v1/chain/get_raw_abi', {body: `{"account_name": "fio.address"}`, method: 'POST'})).json()
  abiMap.set('fio.address', tokenRawAbi)
 
  var privateKeys = [privateKey];
  
  const tx = await Fio.prepareTransaction({
    transaction,
    chainId,
    privateKeys,
    abiMap,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  pushResult = await fetch(httpEndpoint + '/v1/chain/register_fio_address', {
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

fiojsRegaddress();

