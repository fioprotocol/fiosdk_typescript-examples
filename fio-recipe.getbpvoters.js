/**
 * Script to find all the accounts that have voted for a specified Block Producer and return the fees paid
 */

const rp = require('request-promise');

const baseUrl = 'http://fio.greymass.com/v1/'
const urlApi = baseUrl + 'chain/'
const urlHistory = baseUrl + 'history/'
const bpAccount = '';  // Account for BP

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

const getbpvoters = async () => {
    let voterList = [];
    let done = false;
    let voters, voter;
    const limit = 200;
    let lowerBound = 0;

    try {
        while (!done) {

            // First loop through all voters and find out which ones voted for the BP account

            const json = {
            json: true,
            code: 'eosio',
            scope: 'eosio',
            table: 'voters',
            limit: limit,
            lower_bound: lowerBound,
            reverse: false
            }
            voters = await callFioApi(urlApi, "get_table_rows", json);
            //console.log('voters: ', voters);

            for (voter in voters.rows) {
                if (voters.rows[voter].producers.includes(bpAccount)) {
                    //console.log('Producers: ', voters.rows[voter].owner);
                    if (voters.rows[voter].producers.length == 1) {  // Only add when the voter only voted for the single BP
                        voterList.push(voters.rows[voter].owner);
                    }
                    
                }
            }
            lowerBound += limit;
            if (voters.rows.length == 0) { done = true;}
        };

        // Next, get the actions for each user from a V1 History node and parse out the voteproducer actions and the fees

        let user;
        console.log('account,block_time,action,fee')
        for (user in voterList) {
            const json = {
                account_name: voterList[user],
                pos: 100,
                offset: -100
            };

            voterActions = await callFioApi(urlHistory, "get_actions", json);
           // console.log('voterActions: ', voterActions);
            for (action in voterActions.actions) {
                //console.log('action: ', voterActions.actions[action]);
                if (voterActions.actions[action].action_trace.act.name == 'voteproducer') {
                    console.log(voterList[user] + ',' +
                        voterActions.actions[action].block_time + ',' +
                        voterActions.actions[action].action_trace.act.name + ',' +
                        JSON.parse(voterActions.actions[action].action_trace.receipt.response).fee_collected);
                    //voterList.push(voters.rows[voter].owner);
                }
            }
        }

      } catch (err) {
        console.log('Error', err);
      }
}

getbpvoters();


