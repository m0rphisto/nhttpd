/**
 * $Id: Loader.js 2025-04-22 01:24:51 +0200 .m0rph $
 *
 * JSON config / HTML template loader
 */

'use strict';

const
   path  = require('node:path'),
   fs    = require('node:fs'),
   cfg   = require('@lib/Config'),
   {log} = require('@lib/Logger');

/**
 * Private: Loads the JSON menu configuration or HTML template file
 * 
 * @returns {object} The JSON menu object.
 */
const load = (file) => {
   return fs.readFileSync(file, { encoding: 'utf-8'}, (err, data) => {
      if (err) {
         log(1, 'ERROR', `Could not load file ${file}`);
         console.log(`[ERROR] Could not load file ${file}`);
         return '{"error": "Could not load file'+file+'"}';
      }
      else
         return data;
   });
}

/**
 * Private: JSON file parser. Returns the JavaScript JSON object.
 *
 * +-----------------------------------+
 * | TODO: Do we really need this one? | We will see.
 * +-----------------------------------+
 * 
 * @param {string} data The data of the JSON configuration file.
 * @returns {array}     Array with key/value pairs.
 * /
const parse = (data) => {
   const json = JSON.parse(data);
   let keys = [], values = [];
   for (const [key, val] of Object.entries(json)) {
      keys.push(key);
      values.push(val);
   }
   return [keys, values];
}
*/

/**
 * Public: Returns a JavaSript object from the loaded JSON file.
 * 
 * @returns {string} The JavaSript object
 */
exports.json = (file) => {
   return JSON.parse(load(path.join(cfg.JSON, file)));
}

/**
 * Public: Returns an XML file.
 * 
 * @param   {string} file The filename to get
 * @returns {string}      The XML data
 */

exports.xml = (file) => {
   return load(path.join(cfg.XML, file));
}

/**
 * Public: Returns the HTML template.
 * 
 * @returns {string} The menu template
 */

exports.view = (file) => {
   return load(path.join(cfg.VIEWS, file));
}
