/**
 * $Id: GeoipLookup.js 2023-12-29 03:14:56 +0100 .m0rph $
 *
 * Geoip Database Lookup
 *
 * Usage:
 *    IP address: result['ip']
 *    IP Number: result['ipNo']
 *    Country key: result['countryShort']
 *    Country: result['countryLong']
 *    Region: result['region']
 *    City: result['city']
 */

'use strict';

const cfg = require('@lib/Config');
const {IP2Location} = require('ip2location-nodejs');

/**
 * Public: Returns the ip2location data
 * 
 * @param   {string} ip  The ip address
 * @returns {object}     The geoip data
 */
exports.data = (ip = null) => {
   if (ip) {
      const ip2location = new IP2Location();
      try {
         ip2location.open(cfg.ROOT+'/geoip/IP2LOCATION-LITE-DB3.BIN');
         const result = ip2location.getAll(ip);
         ip2location.close();
         return result;
      } catch {
         return null;
      }
   }
}
