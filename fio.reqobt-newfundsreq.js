const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = 'http://fiotestnet.greymass.com/v1/'

const privateKey = '5KkxhScXVFb3d7eBMPKQQj2pVwJLy6WQMGBRXWJ59Et9GmPQ1nd',
  publicKey = 'FIO4xTG4QAzX2Zgh8UYrfDLfTovb1AL176mDAWTnQYz2jG1Jqoeip'


const newfundsreq = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'newfundsreq',
      account: 'fio.reqobt',
      data: {
        payer_fio_address: 'payer1@fiotestnet',
        payee_fio_address: 'payee1@fiotestnet',
        tpid: '',
        content: {
          payee_public_address: 'jG1JqoeipjG1JqoeipjG1JqoeipjG1JqoeipjG1JqoeipjG1JqoeipjG1JqoeipjG1Jqoeip',
          amount: 2000000000,
          chain_code: 'FIO',
          token_code: 'FIO',
          memo: 'jG1JqoeipjG1JqoeipjG1JqoeipjG1JqoeipjG1Jqoeip'
        },
        max_fee: 100000000000,
        actor: 'd31l2vcgm5t4'
      }
    })

    const result = await user.genericAction('requestFunds', {
      payerFioAddress: 'payer1@fiotestnet',
      payeeFioAddress: 'payee1@fiotestnet',
      maxFee: 100000000000,
      payeeTokenPublicAddress: 'FIO4xTG4QAzX2Zgh8UYrfDLfTovb1AL176mDAWTnQYz2jG1Jqoeip',
      amount: 1000000000,
      chainCode: 'FIO',
      tokenCode: 'FIO',
      memo: 'memo'
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err);
    console.log('Details: ', err.json);
    console.log('Details2: ' + err.json.fields[0].value)
  }
}

newfundsreq();