const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'https://testnet.fioprotocol.io/v1/'
//const baseUrl = 'https://fio.greymass.com/v1/'

const privateKey = '',
  publicKey = '',
  fio_address = '',
  max_fee = 100000000000

const nft = {
  chain_code: '',
  contract_address: '',
  token_id: ''
}

const remnft = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'remnft',
      account: 'fio.address',
      data: {
        fio_address: fio_address,
        nfts: [
          {
            chain_code: nft.chain_code,
            contract_address: nft.contract_address,
            token_id: nft.token_id
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

remnft();