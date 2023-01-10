const {FIOSDK } = require('@fioprotocol/fiosdk');
fetch = require('node-fetch');
const rp = require('request-promise');
const fs = require('fs');
const properties = require('./properties.js');

const baseUrl = properties.server + '/v1/'

const fiourl = baseUrl + "chain/";
const privateKey = properties.privateKey,
  publicKey = properties.publicKey

const fetchJson = async (uri, opts = {}) => {
  return fetch(uri, opts)
}

async function timeout(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function callFioApi(apiCall, JSONObject) {
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

const burnExpired = async () => {

  user = new FIOSDK(
    privateKey,
    publicKey,
    baseUrl,
    fetchJson
  )

  const retryLimit = 1; // Number of times to call burnexpired with the same offset/limit when hitting a CPU limit error

  let currentDomainName;
  let offset = 1;
  let limit = 500;
  let retryCount = 0;
  let empty = false;
  let burned = false;
  let workDoneThisRound = true;
  let workDoneThisOffset = false;
  let count = 1; 
  let burnLowerBound;
  let newOffset;
  const burnLimit = 1;

  const curdate = new Date();
  const ninetyDaysInSecs = 90*24*60*60;
  const utcSeconds = (curdate.getTime() + curdate.getTimezoneOffset()*60*1000)/1000;  // Convert to UTC
  const utcMinus90Days = utcSeconds - ninetyDaysInSecs;
  console.log('utcSeconds = ', utcSeconds);
  
  console.log('ninetyDaysInSecs = ', ninetyDaysInSecs);
  console.log('plus = ', utcSeconds - ninetyDaysInSecs);

  while (!empty) {
    console.log('\noffset: ', offset);  
    console.log('limit: ', limit);  

    const json = {
      json: true,
      code: 'fio.address',
      scope: 'fio.address',
      table: 'domains',
      limit: limit,
      lower_bound: offset,
      reverse: false,
      show_payer: false
    }
    domains = await callFioApi("get_table_rows", json);

    if (domains.rows.length == 0) {
        empty = true;
        break;
    } else {   
      // Step through each expired domain
      for (domain in domains.rows) {
        currentDomainName = domains.rows[domain].name
        if (domains.rows[domain].expiration < utcMinus90Days) {
          burnLowerBound = domains.rows[domain].id; 
          burned = false;

          fs.appendFile("./burned-domains.txt", `\nDomain: ${domains.rows[domain].name}`, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("\nBurning: ", currentDomainName);
          }); 

          while (!burned) {
            pushResultBefore = await fetch(baseUrl + 'chain/get_table_rows', {
              body: `{
              "json": true,
              "code": "fio.address",
              "scope": "fio.address",
              "table": "domains",
              "limit": "1",
              "lower_bound": "${burnLowerBound}",
              "reverse": false,
              "show_payer": false
            }`,
              method: 'POST',
            });

            resultBefore = await pushResultBefore.json()

            try {
              const result = await user.genericAction('pushTransaction', {
                action: 'burnexpired',
                account: 'fio.address',
                data: {
                  actor: user.account,
                  offset: burnLowerBound,
                  limit: burnLimit
                }
              })
              console.log('Offset = ' + burnLowerBound + ', Limit = ' + burnLimit + ', Result: {status: ' + result.status + ', items_burned: ' + result.items_burned + ' }');
              workDoneThisOffset = true;
              workDoneThisRound = true;
              retryCount = 0;
              await timeout(1000); // To avoid duplicate transaction
            } catch (err) {
              workDoneThisOffset = false;
              //console.log('Error: ', err);
              
              if (err.errorCode == 400 && err.json.fields[0].error == 'No work.') {
                console.log('No Work ')
                burned = true; // If no work done, exit out of this domain
                break;
              } else if (err.json.code == 500 && err.json.error.what == 'Transaction exceeded the current CPU usage limit imposed on the transaction') {
                console.log('Error: Offset = ' + burnLowerBound + ', Limit = ' + burnLimit + ', Result: Transaction exceeded the current CPU usage limit imposed on the transaction');
                retryCount++;
              } else {
                console.log('UNEXPECTED ERROR: ', err);
              }

            }

            pushResult = await fetch(baseUrl + 'chain/get_table_rows', {
              body: `{
              "json": true,
              "code": "fio.address",
              "scope": "fio.address",
              "table": "domains",
              "limit": "1",
              "lower_bound": "${burnLowerBound}",
              "reverse": false,
              "show_payer": false
            }`,
              method: 'POST',
            });

            result = await pushResult.json()
            
            if (result.rows.length == 0) {
              console.log("DONE\n");
              count = 1;  // Start again
              // If this is the first round, or work was done during the round, reset 
              if (workDoneThisRound) {
                workDoneThisRound = false;
              } else {
                burned = true;  // No work was done this round and we are at the end of the domains
              }
            } else if (result.rows[0].name != currentDomainName) {
              console.log("DONE: (different domain found)\n");
              burned = true;  // No work was done this round and we are at the end of the domains
            } else {
              // Only increment the offset if no work was done
              if (!workDoneThisOffset) {
                // If you have done several retries, exit out of while !burned loop
                if (!workDoneThisOffset) {
                  // If you have done several retries, move to next offset
                  if (retryCount == 0) {
                    count++;
                  } else if (retryCount >= retryLimit) {
                    retryCount = 0;
                    count++;
                  }
                }
              };
            }
          }; // while !burned
        }; // if
      };  // for

      if (domain == domains.rows.length - 1) {
        newOffset = domains.rows[domain].id + 1; // Start the next iteration at the next record
      }
    };  // else

    offset = newOffset;

  };  // while !empty
}

burnExpired();