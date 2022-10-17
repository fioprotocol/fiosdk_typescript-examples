/**
 * fio-recipe.generate-hash.js
 * 
 * Useful for getting the SHA 256 hash of fields for use in get_table_rows.
 * 
 */
const rp = require('request-promise');
const createHash = require('create-hash');

const baseUrl = 'http://fio.greymass.com/v1/'
const urlApi = baseUrl + 'chain/'
const contract = '';  // e.g., '0xF5db804101d8600c26598A1Ba465166c33CdAA4b'

function stringToHash (term){
    const hash = createHash('sha1');
    return '0x' + hash.update(term).digest().slice(0, 16).reverse().toString('hex');
};

function callFioApi(fiourl, apiCall, JSONObject) {
    return (new Promise(function(resolve, reject) {
        var options = {
            method: "POST",
            uri: fiourl + apiCall,
            body: JSONObject,
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (body){
                //console.log(body);
                resolve(body);
            }).catch(function(ex) {
                reject(ex);
            });
    }));
};


const generateHash = async () => {

    const json = {
        json: true,
        code: 'fio.address',
        scope: 'fio.address',
        table: 'nfts',
        lower_bound: stringToHash(contract),
        upper_bound: stringToHash(contract),
        key_type: 'i128',
        index_position: '3'
    }

    result = await callFioApi(urlApi, "get_table_rows", json);

    console.log('Count: ', result.rows.length)
    //console.log(result);

}

generateHash();