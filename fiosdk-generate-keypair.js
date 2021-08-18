const { FIOSDK } = require('@fioprotocol/fiosdk')

const mnemonicExample = 'valley alien library bread worry brother bundle hammer loyal barely dune brave',
  privateKeyExample = '5Kbb37EAqQgZ9vWUHoPiC2uXYhyGSFNbL6oiDp24Ea1ADxV1qnu',
  publicKeyExample = 'FIO5kJKNHwctcfUM5XZyiWSqSTM5HTzznJP9F3ZdbhaQAHEVq575o',
  accountExample = 'ltwagbt4qpuk'

const genKeys = async () => {

  const keyRes = await FIOSDK.createPrivateKeyMnemonic(mnemonicExample);
  const privateKey = keyRes.fioKey;
  const publicKey = FIOSDK.derivedPublicKey(privateKey).publicKey;
 
  account = FIOSDK.accountHash(publicKey).accountnm;
  console.log('acct: ', account)

  console.log(`Private Key: ${privateKey}  // Expect it to be: ${privateKeyExample}`);
  console.log(`Public Key: ${publicKey}  // Expect it to be: ${publicKeyExample}`);
  console.log(`Account: ${account}  // Expect it to be: ${accountExample}`);

  // See this testnet account on the FIO Explorer: https://fio-test.bloks.io/account/ltwagbt4qpuk

}

genKeys();