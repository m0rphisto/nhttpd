/**
 * $Id: Sanitizer.js 2025-04-24 21:16:04 +0200 .m0rph $
 */

'use strict';

const
   fs          = require('node:fs'),
   path        = require('node:path'),
   url         = require('node:url'),
   cfg         = require('@lib/Config'),
   {CommonLib} = require('@lib/Common'),
   {header}    = require('@lib/Headers');

const cl = new CommonLib();

const status_codes = cl.loadJson('HTTPStatusCodes.json');
const forbiddenFiles = cl.loadJson('ForbiddenFiles.json');
const allowedPaths = cl.loadJson('AllowedPaths.json').map((regex) => new RegExp(regex));
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
      req.on('error', err => reject(err));
      req.on('data', chunk => {
         body += chunk.toString()
         if (body.length > 1e6) req.connection.destroy(); // flooding protection
      });
      req.on('end', () => {
         const params = new url.URLSearchParams(body);
         const inputs = {
            url: req.url,
            email: params.get('email')?.trim() || '',
            name: params.get('name')?.trim() || '',
            organization: params.get('organization')?.trim() || '',
            title: params.get('title')?.trim() || '',
            message: params.get('message')?.trim() || ''
         };
         resolve(inputs);
      });
   });
}

/**
 * Private: Checks input field for suspicious content that could be dangerous for the
 *          mail server. We don't want to be misused as a spam relay!
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Chars found := !!1, or not := !!0
 */
const chkInputValues = (str) => {
   const strToLower = str.toLowerCase();
   return /(?:content-type|b?cc|to|mime-version):|multipart\/|<script|<\/script|%0a|%0d/i.test(strToLower);
}

/**
 * Private: Checks if we have a valid eMail address.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Chars found := !!1, or not := !!0
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Private: Builds eMail from the contact form data
 * 
 * @param   {object} {email,name,organization,title,message} The form data fields
 * @returns {string}                                         The eMail body
 */
const eMailTemplate = ({ url, email, name, organization, title, message }) => {
   return `url: ${url}
email: ${email}
name: ${name || '*****'}
organization: ${organization || '*****'}
title: ${title || '*****'}
date: ${cl.d.date()} ${cl.d.time()}
ipaddr: ${cfg.ipaddr}
message:
${message}

`;
}


/**
 * Private: Checks a string for forbidden control chars.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Chars found := !!1, or not := !!0
 * /

The little payloader.pl showed, that nodejs already blocks them on the
HTTP stack .on('clientError', ... ), so we don't need that here. ;-)
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
      if (result) cl.log(1, cfg.ipaddr, '[ERROR] Found double encoding !!!');
      return result;
   } catch(err) {
      // A malformed URL can crash the systrem !!!
      cl.log(1, cfg.ipaddr, `[ERROR] Found malformed string. ${err}`);
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
         cl.log(1, cfg.ipaddr, `[ERROR] Found malformed string. ${err}`);
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
 * Private: Checks POST data for forbidden chars.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */
const isSafeString = (str) => {
   return /^[0-9a-zA-ZäöüÄÖÜß,.;:#'+*~!"§$%&(){}\[\]\\\/_\-\s]*$/.test(str);
}
/**
 * Private: Checks POST data for forbidden chars.
 * 
 * @param   {string}  str The string to check
 * @returns {boolean}     Data is OK := !!1, or not := !!0
 */
const isSafeMsgString = (str) => {
   return /^[0-9a-zA-ZäöüÄÖÜß,.;:#'+*~!"§$%&(){}\[\]\\\/_\-\s\r\n]*$/.test(str);
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
 * Private: Checks HTTP headers and sanitizes them and necessarily
 *          blocks them.
 * 
 * @param   {object}  headers  The request.headers object
 * @returns {object}  hdrs     The clean headers
 */
const chkHeaders = (headers) => {
   let hdrs = {};
   // Atfirst we load the headers whitelist.
   const whitelist = cl.loadJson('HTTPHeadersList.json').map((regex) => new RegExp(regex, 'i'));
   Object.entries(headers).map(([key, value]) => {
      for (const pattern of whitelist) {
         // Check for header in whitelist
         if (pattern.test(key)) {
            // Header allowed, so inspect and sanitize it
            //value = value.replace(/[^\x20-\x7E]+/g, ''); // only printables allowed
            value = value.replace(/[^a-zA-Z0-9\s.,:;\/?@&=+\-"'(){}\[\]<>!#$%*~|\\]+/g, ''); // or maybe more strict !!
            hdrs[key] = value.trim(); // delete pre- and post-spaces
            // continue; <-- ONLY ENDS THE for, but we need to do the next .map(element)
            return;
         }
      }
   });
   return hdrs;
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
      cl.log(1, 'ERROR', 'Could not load forbidden files list.');
      res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end('500 - Internal Server Error');
      process.exit(1);
   }
   if (! allowedPaths) {
      // ... no forbidden files list, then we have to quit.
      cl.log(1, 'ERROR', 'Could not load allowed paths list.');
      res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end('500 - Internal Server Error');
      process.exit(1);
   }

   // Just for debuggingpurposes.
   //console.log(`[DEV]######################################################################## `);
   //const parsedURL = url.parse(`${cfg.PROTO}${cfg.HOSTNAME}/${req.url}`);
   //console.dir(parsedURL, { depth: null, colors: true });
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
      cl.log(1, cfg.ipaddr, `Found forbidden request method ${req.method}`);
      res.writeHead('405', header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['405']}`);
      return !!0;
   }

   // Check URL path (forbidden files, safe and allowed paths)
   const URL = urlDecode(req.url); // returns null if malformed.
   if (URL && (forbidden(URL) || !allowed(URL) || !isSafePath(URL))) {
      res.writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['404']}`);
      cl.log(1, cfg.ipaddr, `${status_codes['404']} FORBIDDEN ${req.method} ${req.url}`);
      return !!0;
   }

   if (hasDoubleEncoding(req.url)) {
      // Check if someone tries to inject double encoded XSS.
      res.writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['404']}`);
      cl.log(1, cfg.ipaddr, `${status_codes['404']} (~XSS~) ${req.method} ${req.url}`);
      return !!0;
   }
   
   // Check headers (escape and log).
   cfg.httpHeaders = chkHeaders(req.headers);
   for (const [key, value] of Object.entries(req.headers)) {
      cl.collect(key, cfg.ipaddr, value);
      if (key in cfg.httpHeaders) continue;
      cl.log(1, cfg.ipaddr, `BLOCKED HEADER ${req.method} ${key}(${value})`);

      // No error to return here.
   }

   // ToDo: Check cookies (we do not set yet any).
   //   At the moment we do not use any cookies, maybe later.
   //   So the only thing we do for now is to set Cookies header null, if present.
   //if (headers['Cookie']) headers['Cookie'] = null;



   // Check POST data (if present)
   if (req.method === 'POST') {
      cfg.postData = { stat: !!1, code: '200', txt: 'OK', inputs: {} };
      cfg.postData.inputs = await mkPostData(req);
      const suspicious = Object.values(cfg.postData.inputs).some(value => chkInputValues(value));      
      const valid = isValidEmail(cfg.postData.inputs.email)
         && isSafeString(cfg.postData.inputs.name)
         && isSafeString(cfg.postData.inputs.title)
         && isSafeString(cfg.postData.inputs.organization)
         && isSafeMsgString(cfg.postData.inputs.message);
      const file = `inquiry.${cl.d.timestamp()}.${cfg.ipaddr}.txt`;
      const dir = suspicious || !valid ? cfg.PAYLOADS : cfg.CONTACT;
      const eMail = eMailTemplate(cfg.postData.inputs);
      fs.writeFile(path.join(dir, file), eMail, { encoding: 'utf8', flag: 'w', mode: 0o0640 }, (err) => {
         if (err) {
            cl.log(1, cfg.ipaddr, `ERROR Could not save contact form - ${err}`);
            cfg.postData.txt = `Could not save contact form. Please contact webmaster@${cfg.HOSTNAME}`;
            cfg.postData.code = '500';
         }
         if (suspicious || !valid) {
            cl.log(1, cfg.ipaddr, `ERROR ${req.method} Saved suspicious/invalid input!`);
            res.writeHead(400, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
            res.end(`${status_codes['400']}${suspicious ? '- Input saved. Will learn from. THX !!!' : ''}`);
            cfg.postData.stat = !!0;
         }
      });
      cfg.postData.txt = 'Thank you for your interest in my services. I will contact you as soon as possible.';
      return cfg.postData.stat;
   }

   // Everything is OK, so return true.
   return !!1;
}
// EOF
