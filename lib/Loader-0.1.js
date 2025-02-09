/**
 * $Id: Loader.js v0.1 2023-12-27 21:37:36 +0100 .m0rph $
 *
 * HTML template menu loader
 */

const fs = require('node:fs');

/**
 * Private: Loads the JSON menu configuration or HTML template
 * 
 * @returns {object} The JSON menu object.
 */
const load = (file) => {
   return fs.readFileSync(file,  { encoding: 'utf-8' });
}

/**
 * Private: JSON file parser. Returns the JavaScript JSON object.
 *  
 * @param {string} data The data of the JSON configuration file.
 * @returns {array}     Array with key/value pairs.
 */
const parse = (data) => {
   const json = JSON.parse(data);
   let keys = [], values = [];
   for (const [key, val] of Object.entries(json)) {
      keys.push(key);
      values.push(val);
   }
   return [keys, values];
}


/**
 * Public: Returns the menu css header tag template.
 * 
 * @returns {string} The tag template.
 */
exports.css = () => {
   return load('templates/menu-css.html');
}

/**
 * Public: Returns the menu HTML template.
 * 
 * @returns {string} The menu template
 */

exports.html = () => {
   return load('templates/menu.html');
}
