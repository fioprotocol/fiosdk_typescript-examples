const {FIOSDK } = require('@fioprotocol/fiosdk')
fetch = require('node-fetch')
const properties = require('./properties.js')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

const baseUrl = properties.server + '/v1/'

const privateKey = properties.privateKey,
  publicKey = properties.publicKey,
  payeeKey = '',        // FIO Public Key of the payee
  canVote = 0,          // This indicates if the locked amount can vote/proxy while locked. 0 = can NOT vote, 1 = can vote.
  amount = 4000000000,  // Total amount locked in SUFs.
  periods = [
    {
      "duration": 500,
      "amount": 3000000000
    },
    {
      "duration": 700,
      "amount": 1000000000
    }
  ],
  max_fee = 10000000000


const trnsloctoks = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  try {
    const result = await user.genericAction('pushTransaction', {
      action: 'trnsloctoks',
      account: 'fio.token',
      data: {
        payee_public_key: payeeKey,
        can_vote: canVote,
        periods: periods,
        amount: amount,
        max_fee: max_fee,
        tpid: ''
      }
    })
    console.log('Result: ', result)
  } catch (err) {
    console.log('Error: ', err);
    console.log('Details: ', err.json)
  }
}

trnsloctoks();