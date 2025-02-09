/**
 * $Id: Template.js v0.2 2025-01-12 07:06:18 +0100 .m0rph $
 *
 * HTML Template Parser
 */

const
   cfg = require('../config.js');

/**
 * 
 * @param {string} data The HTML document 
 * @returns {string} The footer finalized document
 */
const copyright = (data) => {
   //let out = data.replace(/{WEBMASTER}/g, 'm0rphisto.net@gmail.com');
   let out = data.replace(/{WEBMASTER}/g, cfg.EMAIL_ADDRESS);
   return out.replace(/{COPYRIGHT}/g, `2006&nbsp;\u3192&nbsp;${new Date().getFullYear()}`);
}


/**
 * Public: We need to send the correct MIME type. 
 * @param {string} url The URL of the requested file
 * @returns {string} MIME type
 */
exports.mime = (url) => {
   if      (url.match('.html$')) return 'html';
   else if (url.match('.css$'))  return 'css';
   else if (url.match('.js$'))   return 'js';
   else if (url.match('.json$')) return 'json';
   else if (url.match('.jpg$'))  return 'jpg';
   else if (url.match('.png$'))  return 'png';
   else if (url.match('.gif$'))  return 'gif';
   else                          return 'txt';
}

/**
 * Public: The HTML template parser
 * @param {string} data The HTML template
 * @param {object} tmplvars The template variables that have to be replaced
 * @returns {string} The finished HTML document.
 */
exports.parse = (data, tmplvars) => {
   let out = copyright(data.toString()); // Convert to String object !!!
   for (const [key, val] of Object.entries(tmplvars)) {
      out = out.replaceAll(`{${key}}`, val); // or we cannot RegEx !!!
   }
   return out;
}

/**
 * Public: Final variable cleaner. Delete all unused template variables.
 * 
 * @param   {string} data  The HTML template
 * @returns {string}       The cleaned HTML document
 */
exports.finalize = (data) => {
   return data.replaceAll(/{[A-Z0-9_]*}/g, '');
}
