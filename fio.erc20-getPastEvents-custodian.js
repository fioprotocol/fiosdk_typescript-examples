/**
 * Gets "custodian" events from the erc20 contract. Requires a .env file with:
 *   etheInfura=https://mainnet.infura.io/v3/<key>
 *   erc20Contract=<contractaddress>
 */

require('dotenv').config();
const Web3 = require('web3');

const { ethInfura, erc20Contract } = process.env;

const web3 = new Web3(ethInfura);

const erc20ABI = require("./Contracts/ERC20.json");
const wfioContract = new web3.eth.Contract(erc20ABI, erc20Contract);

const getPastEventsCustodian = async () => {

  try {
    let approvals = [];

    const transactions = await wfioContract.getPastEvents('consensus_activity', {
        fromBlock: 0,
        toBlock: 'latest'
    })

    let i = 0;
    for (txn in transactions) {
        if (transactions[txn].returnValues.signer === 'custodian') {
          approvals[i] = {"account": transactions[txn].returnValues.account, "indexhash": transactions[txn].returnValues.indexhash};
          i++;
        }
    }
    
    approvals.sort();

    let currentAcct;
    approvals.forEach(function (approval, index) {
      if (approval.account != currentAcct) {
        currentAcct = approval.account;
        console.log("Account: ", currentAcct);
        console.log("    Approval: ", approval.indexhash);
      } else {
        console.log("    Approval: ", approval.indexhash);
      }
    });

      
  } catch (err) {
      console.log('Error: ', err);
  }

}

getPastEventsCustodian();