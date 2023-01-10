/**
 * Script to find all the NFTs mapped with a specific contract
 */

const rp = require('request-promise');

const baseUrl = 'http://fiotestnet.greymass.com/v1/'
const urlApi = baseUrl + 'chain/'
const contract = ''; 

function callFioApi(fiourl, apiCall, JSONObject) {
    return (new Promise(function(resolve, reject) {
        var options = {
            method: "POST",
            uri: fiourl + apiCall,
            body: JSONObject,
            json: true
        };

        rp(options)
            .then(function (body){
                resolve(body);
            }).catch(function(ex) {
                reject(ex);
            });
    }));
};

const getnftidsforcontract = async () => {
    let nfts;
    let nftList = [];
    let done = false;
    const limit = 200;
    let lowerBound = 0;

    try {
        while (!done) {
            const json = {
            json: true,
            code: 'fio.address',
            scope: 'fio.address',
            table: 'nfts',
            limit: limit,
            lower_bound: lowerBound,
            reverse: false
            }
            nfts = await callFioApi(urlApi, "get_table_rows", json);
            //console.log('nfts: ', nfts);

            nfts.rows.forEach(function (nft, index) {
                if (nft.contract_address == contract) {
                    nftList.push({"fio_address": nft.fio_address, "chain_code": nft.chain_code, "contract_address": nft.contract_address, "token_id": nft.token_id, "url": nft.url,"hash": nft.hash, "metadata": nft.metadata });
                }
              });

            lowerBound += limit;
            if (nfts.rows.length == 0) { done = true;}
        };

        console.log(`${contract} has ${nftList.length} mapped NFTs\n`)
        console.log('NFTs: ', nftList);     

      } catch (err) {
        console.log('Error', err);
      }
}

getnftidsforcontract();


