# fiosdk_typescript-examples

## Install prerequisites

The following prerequisites are required to run the examples on a mac

* [Homebrew](https://brew.sh)
* [Node version manager](https://tecadmin.net/install-nvm-macos-with-homebrew/)  (optional)
* [nodejs](https://nodejs.dev)
* [VS Code](https://code.visualstudio.com) (or other development environment)

## Set up Testnet accounts

You will need one or more [FIO Testnet ](https://fio-test.bloks.io) accounts to run examples that create transactions on the blockchain. Refer to the [FIO Devhub Testnet page](https://developers.fioprotocol.io/docs/chain/testnet) for information on generating key pairs and getting FIO from the Testnet faucet.

## Install fiosdk_typescript-examples

Next, download fiosdk_typescript-examples repository and install: 

```
git clone https://github.com/fioprotocol/fiosdk_typescript-examples
cd fiosdk_typescript-examples
npm install
```

## Create properties file

Create a properties.js file in the root directory and insert the Testnet public and private keys that you set up in the previous step. 

```
const properties = {
  server: '',
  publicKey: '',
  privateKey: '',
  account: ''
};

module.exports = properties;
```

## Run example

Lastly, add any required parameters in the example file and run. For example:

```
node fio.address-addnft.js
```

Refer to the [FIO API](https://developers.fioprotocol.io/pages/api/fio-api/#tag--Getters) for details on FIO blockchain actions.