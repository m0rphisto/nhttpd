/**
 * $Id: geoiplookup.js v1.0 2023-12-28 23:09:56 +0100 .m0rph $
 *
 * This is a little local test script.
 */

'use strict';

const {IP2Location} = require('ip2location-nodejs');

let ip2location = new IP2Location();

ip2location.open('geoip/IP2LOCATION-LITE-DB3.BIN');

const ip = '79.199.124.55';
const result = ip2location.getAll(ip);
console.log('-----------------------------------------------');
console.log(`IP address: ${result['ip']}`);
console.log(`IP Number: ${result['ipNo']}`);
console.log(`Country key: ${result['countryShort']}`);
console.log(`Country: ${result['countryLong']}`);
console.log(`Region: ${result['region']}`);
console.log(`City: ${result['city']}`);
console.log('-----------------------------------------------');

/*
for (const key in result) {
   console.log(`${key}: ${result[key]}`);
}
*/

ip2location.close();
// EOF
