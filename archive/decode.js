//import fetch from "node-fetch";
//import ser from "@fioprotocol/fiojs/dist/chain-serialize.js";
//import { fromHexString } from "./utils.js";

const {FIOSDK } = require('@fioprotocol/fiosdk')



const fetch = require('node-fetch')
const ser = require('@fioprotocol/fiojs/dist/chain-serialize.js')
//const { fromHexString }  = require('node-fetch')

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
  // Deserialize the entire transaction

  usersdk = new FIOSDK(
    '',
    '',
    baseUrl,
    fetchJson
  )

  const info = await (await fetch(httpEndpoint + '/v1/chain/get_info')).json();
  const chainId = info.chain_id;

  const res2 = await usersdk.transactions.deserialize({
    chainId: chainId,
    serializedTransaction,
  });
  console.log('res2: ', res2)

  const abiMsig = await (
    await fetch(httpEndpoint + "/v1/chain/get_abi", {
      body: `{"account_name": "eosio.msig"}`,
      method: "POST",
    })
  ).json();
  const transactionTypes = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiMsig.abi
  );
  console.log(transactionTypes.keys());
  const txType = transactionTypes.get("transaction");

  const buf = new ser.SerialBuffer({ array: serializedTransaction });
  const trx = txType.deserialize(buf);
  console.log("trx => \n", JSON.stringify(trx, null, 2));

  // Deserialize the action data
  const { account, name, data } = trx.actions[0];
  const actionDataByte = fromHexString(data);
  const abiFioAddress = await (
    await fetch(httpEndpoint + "/v1/chain/get_abi", {
      body: `{"account_name": "fio.address"}`,
      method: "POST",
    })
  ).json();
  // Get a Map of all the types from fio.address
  const typesFioAddress = ser.getTypesFromAbi(
    ser.createInitialTypes(),
    abiFioAddress.abi
  );
  // Get the addaddress action type
  const actionAddaddressType = typesFioAddress.get("addaddress");
  const buf2 = new ser.SerialBuffer({ array: actionDataByte });
  const actionData = actionAddaddressType.deserialize(buf2);
  console.log("actionData => ", actionData);
};

decodeTxn();
