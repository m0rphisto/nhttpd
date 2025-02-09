/**
 * $Id: Loader.js v0.2 2023-12-27 23:56:53 +0100 .m0rph $
 *
 * JSON config / HTML template loader
 */

const fs = require('node:fs');

/**
 * Private: Loads the JSON menu configuration or HTML template file
 * 
 * @returns {object} The JSON menu object.
 */
const load = (file) => {
   try {
      return fs.readFileSync(file, { encoding: 'utf-8' });
   } catch {
      return null;
   }
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
   return JSON.parse(load('json/'+file));
}

/**
 * Public: Returns the HTML template.
 * 
 * @returns {string} The menu template
 */

exports.view = (file) => {
   return load('views/'+file);
}
