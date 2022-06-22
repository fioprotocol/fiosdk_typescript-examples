/**
 * Example code demonstrating how to deserialize a transaction using the FIO sdk.
 */

const {FIOSDK } = require('@fioprotocol/fiosdk')
const fetch = require('node-fetch')

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

function fromHexString(str) {
  if (!str) {
    return new Uint8Array();
  }
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  return new Uint8Array(a);
}

const httpEndpoint = "http://testnet.fioprotocol.io";
const baseUrl = httpEndpoint + '/v1/'

const txn = {
  compression: 0,
  packed_context_free_data: "",
  packed_trx:
    "7a458a61cdd0167fbe2200000000010000980ad20ca85be0e1d195ba85e7cd01108d4439e7d8910b00000000a8ed32324f3546494f36764b586e43544c646b5451625633706e4b6463484c584c4b435448315439684b796d526e624c384d6a35383164664a5873005ed0b200000000a081203600000000108d4439e7d8910b0000",
  signatures: [
    "SIG_K1_KfuZXa7jSJQyhBzWia48cehCd4CGY2kFB6FaDnpG9ae3MQR7bGxYB8dyVW1LzPWaduWPy46XBHsj4hZ5potnikbNc3Pq2z",
  ],
};

const decodeTxn = async () => {
  // Convert packed transaction hexadecimal string to byte array
  const serializedTransaction = fromHexString(txn.packed_trx);

  usersdk = new FIOSDK(
    '',
    '',
    baseUrl,
    fetchJson
  )

  const info = await (await fetch(httpEndpoint + '/v1/chain/get_info')).json();
  const chainId = info.chain_id;

  const trx = await usersdk.transactions.deserialize({
    chainId: chainId,
    serializedTransaction,
  });
  console.log("trx => \n", JSON.stringify(trx, null, 2));
};

decodeTxn();
