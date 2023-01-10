const {FIOSDK } = require('@fioprotocol/fiosdk');
const rp = require('request-promise');
const fs = require('fs');
const properties = require('./properties.js');

const baseUrl = properties.server + '/v1/'
const fiourl = baseUrl + "chain/";

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t.toLocaleDateString('en-US');
}

/**
 * Generic call to API
 * @param {string} apiCall - The FIO API endpoint.
 * @param {json} JSONObject - The json body to pass to the endpoint.
 * @return {json} - Returns json object.
 */
 function callFioApi(apiCall, JSONObject) {
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

const getExpiredDomains = async () => {
  let currentDomainName;
  let offset = 0;
  let limit = 1000;
  let empty = false;
  let expireDate, burnDate;
  let newOffset;

  const curdate = new Date();
  const ninetyDaysInSecs = 90*24*60*60;
  const utcSeconds = (curdate.getTime() + curdate.getTimezoneOffset()*60*1000)/1000;  // Convert to UTC
  const utcMinus90Days = utcSeconds - ninetyDaysInSecs;
  const expiredDomains = [];
  const logFile = "./expired-domains.txt";

  while (!empty) {
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
        if (domains.rows[domain].expiration < utcSeconds) {
          expireDate = toDateTime(domains.rows[domain].expiration);
          burnDate = toDateTime(domains.rows[domain].expiration + ninetyDaysInSecs);
          expiredDomains.push([domains.rows[domain].expiration, currentDomainName, expireDate, burnDate])
        };
      }; 

      if (domain == domains.rows.length - 1) {
        newOffset = domains.rows[domain].id + 1; // Start the next iteration at the next record
      }
    };
    offset = newOffset;
  }; 

  expiredDomains.sort(function(a, b) {
    return a[0] - b[0];  // Sort on expire date in seconds
  });

  // Delete log file if it exists
  fs.unlink(logFile, function(err) {
    if(err) return console.log(err);
    console.log(`${logFile} deleted successfully`);
  }); 

  // Output to conole and log file
  expiredDomains.forEach(element => {
    console.log(`${element[1]} expiration is ${element[2]} and will be burned on ${element[3]}`);
    fs.appendFile(logFile, `\n${element[1]} expiration is ${element[2]} and will be burned on ${element[3]}`, function(err) {
      if(err) {
          return console.log(err);
      }
    }); 
  });

}

getExpiredDomains();