/**
 * $Id: Controller.js v0.3 2025-04-11 11:29:11 +0200 .m0rph $
 */

const
   fs = require('node:fs'),
   cfg = require('../config'),
   {log} = require('./Logger');


/**
 * Private: Builds and returns a clean controller path.
 * 
 * @param   {string}  url The filename of the controller to load.
 * @returns {string}      The clean require url.
 */

const mkurl = (url) => {
   url.match(new RegExp(/^\/?(.*?)(?:\.html)*$/));
   return '../controller/' + RegExp.$1;
}


/**
 * Public: Does a check, if a module exists whithout chrashing the server !!!
 * 
 * @param   {string}  file The filename of the controller to load.
 * @returns {boolean}      !!1 (true) / !!0 (false)
 */
exports.check = (file) => {  
   try {
      require.resolve(mkurl(file));
      return !!1;
   } catch (err) {
      return !!0;
   }
}

/**
 * Public: Loads the controller for the requested document.
 * 
 * @param   {string} url  The URL of the requested file
 * @returns {object}      The controller object
 */
exports.get = (url) => {
   // Finally redirect request to controller
   return require(mkurl(url));
}
// EOF