/**
 * $Id: Sanitizer.js 2025-04-22 22:31:13 +0200 .m0rph $
 */

'use strict';

const
   fs       = require('node:fs'),
   path     = require('node:path'),
   url      = require('node:url'),
   cfg      = require('@lib/Config'),
   {log}    = require('@lib/Logger'),
   {header} = require('@lib/Headers'),
   Load     = require('@lib/Loader');

const status_codes = Load.json('HTTPStatusCodes.json');
const forbiddenFiles = Load.json('ForbiddenFiles.json');
const allowedPaths = Load.json('AllowedPaths.json').map((regex) => new RegExp(regex));
// Note:
//  .json files don't need to be built up on objects !!!
//  .json files can also contain only arrays.
//   See AllowedPaths.json




/**
 * Private: Builds the document body in case of 'POST' data.
 *
 * Note:
 *    We have to use a Promise here, because the POST data
 *    comes in chunks and has to concatenated!
 * 
 * @param   {object}  req The incoming data, the request object
 * @returns {string}      The document body plus chunk.
 */

const mkPostData = (req) => {
   return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => resolve(body));
      req.on('error', err => reject(err));
   });
}

/**
 * Private: Checks a string for forbidden control chars.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Chars found := !!1, or not := !!0
 * /

The little payloader.pl showed, that nodejs already blocks them
on the HTTP stack, so we don't need that here. ;-)
const hasControlChars = (str) => {
   // ASCII control chars and DEL
   if (/[\x00-\x1f\x7f]/.test(str)) {
      console.log(`[DEBUG] HEX CHARS: ${str}`);
      fs.writeFileSync(
         // We save the payloads for later analysis. ;-)
         `${cfg.PAYLOADS}${path.sep}${cfg.ipaddr}-hexchars.txt`,
         str, {
            encoding: 'utf8',
            mode: 0o0640
         }
      );
      return !!1;
   }
   return !!0;
}
*/

/**
 * Private: Checks URL for double encoding.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */

const hasDoubleEncoding = (str) => {
   try {
      const result = decodeURIComponent(str) !== decodeURIComponent(decodeURIComponent(str));
      if (result) log(1, cfg.ipaddr, '[ERROR] Found double encoding !!!');
      return result;
   } catch(err) {
      // A malformed URL can crash the systrem !!!
      log(1, cfg.ipaddr, `[ERROR] Found malformed string. ${err}`);
      return !!0;
   }
}

/**
 * Private: URL decoder.
 * 
 * @param   {string}  str The string to check
 * @returns {string}      The URL decoded string
 */

const urlDecode = (str) => {
   if (typeof str === 'string') {
      try {
         return decodeURIComponent(str);
      } catch(err) {
         // A malformed URL can crash the systrem !!!
         log(1, cfg.ipaddr, `[ERROR] Found malformed string. ${err}`);
         return null;
      }
   }
}

/**
 * Private: Checks URL for forbidden chars and path traversal.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */

const isSafePath = (str) => {
   return !str.includes('..') && /^[0-9a-zA-Z\/_\-.]*$/.test(str);
}


/**
 * Private: Checks URL for forbidden files.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */
const forbidden = (str) => {
   for (const key of Object.keys(forbiddenFiles)) {
      if (forbiddenFiles.hasOwnProperty(key))
         if (str.match(forbiddenFiles[key])) return !!1;
   }
   return !!0;
}
/**
 * Private: Checks URL for allowed paths.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */
const allowed = (str) => {
   for (const pattern of allowedPaths) {
      if (pattern.test(str)) return !!1
   }
   return !!0;
}


/**
 * Public: Checks incoming data for incoming payloads.
 * 
 * @param   {object} req   The incoming data, the request object
 * @param   {object} res   The outgoing data, the response object
 * @returns {boolean}      Data is OK := !!1, or not := !!0
 */
exports.chkInput = async (req, res) => {

   // Get IP address for logging purposes.
   //const ipaddr = req.socket.remoteAddress;

   if (! forbiddenFiles) {
      // ... no forbidden files list, then we have to quit.
      log(1, 'ERROR', 'Could not load forbidden files list.');
      res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end('500 - Internal Server Error');
      process.exit(1);
   }
   if (! allowedPaths) {
      // ... no forbidden files list, then we have to quit.
      log(1, 'ERROR', 'Could not load allowed paths list.');
      res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end('500 - Internal Server Error');
      process.exit(1);
   }

   //const parsedURL = url.parse(`${cfg.PROTO}${cfg.HOSTNAME}/${req.url}`);
   //console.log(`[DEV]######################################################################## `);
   //console.dir(req, { depth: null, colors: true });
   //console.log(`[DEV]######################################################################## `);

   /**
   // Forbidden control chars in request method or URL?
   As always described at the function, we don't need that one. ;-)
   if (hasControlChars(req.method) || hasControlChars(req.url)) {
      log(1, cfg.ipaddr, `${status_codes['400']} GET FORBIDDEN hex chars !!!`);
      /**
       * NOTE:
       *    This will not work, because .writeHead() has no return value
       *    and so these methods should not be chained !!!
       *    (undefined).end() := ERROR
      res
         .writeHead('400', header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt')
         .end(`${status_codes['400']}`);
       * /
      res.writeHead('400', header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['400']}`);
      return !!0;
   }

   //  Forbidden control chars in POST data, if present?
   const body = (req.method === 'POST') ? await mkPostData(req) : null;
   if (body && hasControlChars(body)) {
      log(1, cfg.ipaddr, `${status_codes['400']} POST FORBIDDEN hex chars !!!`);
      res.writeHead('400', header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['400']}`);
      return !!0;
   }*/

   // Check request method.
   const allowedMethods = ['GET', 'POST'];
   if (! allowedMethods.includes(req.method)) {
      log(1, cfg.ipaddr, 'Found forbidden request method');
      res.writeHead('405', header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['405']}`);
      return !!0;
   }

   // Check URL path (forbidden files, safe and allowed paths)
   const URL = urlDecode(req.url); // returns null if malformed.
   if (URL && (forbidden(URL) || !allowed(URL) || !isSafePath(URL))) {
      res.writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['404']}`);
      log(1, cfg.ipaddr, `${status_codes['404']} FORBIDDEN ${req.url}`);
      return !!0;
   }

   if (hasDoubleEncoding(req.url)) {
      // Check if someone tries to inject double encoded XSS.
      res.writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['404']}`);
      log(1, cfg.ipaddr, `${status_codes['404']} (~XSS~) ${req.url}`);
      return !!0;
   }
   
   // Check headers (escape and log).


   // Check POST data
   const body = (req.method === 'POST') ? await mkPostData(req) : null;


   // ToDo: Check cookies (we do not set yet any).
   //   At the moment we do not use any cookies, maybe later.


   // Everything is OK, so return true.
   return !!1;
}
// EOF
