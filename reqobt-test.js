const {FIOSDK } = require('@fioprotocol/fiosdk');
fetch = require('node-fetch');

const fetchJson = async (uri, opts = {}) => {
    return fetch(uri, opts)
};

const baseUrl = 'http://testnet.fioprotocol.io' + '/v1/';
console.log('baseUrl==> ', baseUrl);
const privateKey = '5JbdbWemy41nd55SR5HvzddgcMht1Pxpsu5seMAkAk9pRYCb6dY',
    publicKey = 'FIO5X9pQxLiczN8YN4fQyW9N7KrPZZiT6vM3uKn34PVTn3UQc9jJJ',
    max_fee = 800 * FIOSDK.SUFUnit;


const transferFio = async () => {

    const fioSdk = new FIOSDK(
        privateKey,
        publicKey,
        baseUrl,
        fetchJson
    );

    let preparedTrx;

    try {
        fioSdk.setSignedTrxReturnOption(true);
        preparedTrx = await fioSdk.genericAction('requestFunds', {
            payerFioAddress: 'testsp3@noonecanstop',
            payeeFioAddress: 'nanasp1@noonecanstop',
            payeePublicAddress: 'FIO5X9pQxLiczN8YN4fQyW9N7KrPZZiT6vM3uKn34PVTn3UQc9jJJ',
            amount: 1000000000,
            chainCode: 'FIO',
            tokenCode: 'FIO',
            memo: 'prepared transaction',
            maxFee: max_fee,
        });

        console.log('Result: ', preparedTrx);

    } catch (err) {
        console.log('Error preparedTrx: ', err);
        console.log('Json error==> : ', JSON.stringify(err.json.fields));
    }

    try {
        // const result = await fioSdk.executePreparedTrx(EndPoint.newFundsRequest, preparedTrx)
        const result = await fioSdk.executePreparedTrx('new_funds_request', preparedTrx);
        console.log('transaction_id: ', result.transaction_id);
        expect(result).to.have.all.keys('fio_request_id', 'status', 'fee_collected', 'block_num', 'transaction_id');
        fioSdk.setSignedTrxReturnOption(false);
    } catch (err) {
        console.log('Error transaction_id: ', err);
        console.log('Json error==> : ', JSON.stringify(err));
    }
};

transferFio();