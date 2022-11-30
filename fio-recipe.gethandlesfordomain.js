/**
 * Script to find all the crypto handles registered with a specific domain
 */

const rp = require('request-promise');

const baseUrl = 'http://fiotestnet.greymass.com/v1/'
const urlApi = baseUrl + 'chain/'
const domain = ''; 

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

const gethandlesfordomain = async () => {
    let handleList = [];
    let done = false;
    let handles = [];;
    const limit = 200;
    let lowerBound = 0;

    try {
        while (!done) {
            const json = {
            json: true,
            code: 'fio.address',
            scope: 'fio.address',
            table: 'fionames',
            limit: limit,
            lower_bound: lowerBound,
            reverse: false
            }
            handles = await callFioApi(urlApi, "get_table_rows", json);
            //console.log('handles: ', handles);

            handles.rows.forEach(function (handle, index) {
                if (handle.domain == domain) {
                    handleList.push(handle.name);
                }
              });

            lowerBound += limit;
            if (handles.rows.length == 0) { done = true;}
        };

        console.log(`${domain} has ${handleList.length} crypto handles\n`)
        console.log('Handles: ', handleList);     

      } catch (err) {
        console.log('Error', err);
      }
}

gethandlesfordomain();


