const { FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  fio_address = '',
  max_fee = 100000000000

const nft = {
  chain_code: '',
  contract_address: '',
  token_id: '',
  url: '',
  hash: '',
  metadata: ''
}

const addnft = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'addnft',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        nfts: [
          {
            chain_code: nft.chain_code,
            contract_address: nft.contract_address,
            token_id: nft.token_id,
            url: nft.url,
            hash: nft.hash,
            metadata: nft.metadata
          }
        ],
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err)
  }
}

addnft();