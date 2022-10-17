const fetch = require('node-fetch')
const properties = require('./properties.js')

const baseUrl = properties.server + '/v1/'

const get_nfts_contract = async () => {
  pushResult = await fetch(baseUrl + 'chain/get_nfts_contract', {
    body: `{
      "chain_code": "bsc",
      "contract_address": "0xF5db804101d8600c26598A1Ba465166c33CdAA4b",
      "token_id": "272076",
      "limit": "100",
      "offset": "0"  
    }`,
    method: 'POST',
  });

  json = await pushResult.json()

  if (json.type) {
    console.log('Error: ', json);
  } else if (json.error) {
    console.log('Error: ', json)
  } else {
    console.log('Result: ', json)
  }
};

get_nfts_contract();