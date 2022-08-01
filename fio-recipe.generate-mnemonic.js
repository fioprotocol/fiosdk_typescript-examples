const { FIOSDK } = require('@fioprotocol/fiosdk')

const genMnemonic = async () => {

  const bip39 = require('bip39');
  const mnemonicExample = bip39.generateMnemonic();
  
  const keyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonicExample);
  const privateKey = keyRes.fioKey;
  const publicKey = FIOSDK.derivedPublicKey(privateKey).publicKey;
 
  account = FIOSDK.accountHash(publicKey).accountnm;

  console.log(`mnemonic: ${mnemonicExample}`);
  console.log(`Private Key: ${privateKey}`);
  console.log(`Public Key: ${publicKey}`);
  console.log(`Account: ${account}`);

  // Confirm this mnemonic on https://iancoleman.io/bip39/ (select FIO as the Coin)

}

genMnemonic();