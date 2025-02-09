/**
 * $Id: Controller.js 2024-01-01 00:48:13 +0100 .m0rph $
 */

/**
 * Public: Loads the controller for the requested document.
 * 
 * @param   {string} url  The URL of the requested file
 * @returns {object}      The controller object
 */
exports.get = (url) => {
   // Redirect request to controller
   url.match(new RegExp(/^\/?(.*?)(?:\.html)*$/));
   try {
      return require('../controller/' + RegExp.$1);
   } catch(err) {
      console.log(`ERROR: ${err}`);
      return null;
   }
}
// EOF