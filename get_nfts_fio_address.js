const fetch = require('node-fetch')
const properties = require('./properties.js')

const baseUrl = properties.server + '/v1/'

const fio_address = ''

const get_nfts_fio_address = async () => {
  pushResult = await fetch(baseUrl + 'chain/get_nfts_fio_address', {
    body: `{
      "fio_address": "${fio_address}",
      "limit": 100,
      "offset": 0
    }`,
    method: 'POST',
  });

  json = await pushResult.json()

  if (json.type) {
    console.log('Error: ', json);
  } else if (json.error) {
    console.log('Error: ', json)
  } else {
    console.log('NFT Signatures for: ', fio_address)
    console.log('Result: ', json)
  }
};

get_nfts_fio_address();