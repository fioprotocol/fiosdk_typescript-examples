const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'http://44.234.118.142:8889/v1/'  
//const baseUrl = 'https://fio.greymass.com/v1/'  // Mainnet

const privateKey = '5KCgHccnEV8aWXkYRR9oApnWfS8WN7FzpPvb2YowbPcUZKckWpY',
  publicKey = 'FIO7JipfZWSCbFjuD3PHuSB6rF6NnhN1W5n8bwec22jaZ9akLi43P',
  fio_address = 'artcollection1@ericnfts',
  max_fee = 100000000000

const nft = {
  chain_code: 'ETH',
  contract_address: '0x63c0691d05f441f42915ca6ca0a6f60d8ce148cd',
  token_id: '100010001',
  url: 'ipfs://ipfs/QmZ15eQX8FPjfrtdX3QYbrhZxJpbLpvDpsgb2p3VEH8Bqq',
  hash: 'f83b5702557b1ee76d966c6bf92ae0d038cd176aaf36f86a18e2ab59e6aefa4b',
  metadata: '{creator_url:https://yahoo.com/}'
}

const addNft = async () => {

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

addNft();