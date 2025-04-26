/**
 * $Id: Config.js 2025-04-24 23:37:30 +0200 .m0rph $
 * 
 * This is the nhttpd configuration script.
 */

'use strict';

const path = require('node:path');
const root = '/var/www/nhttpd';

module.exports = {

   // Defaults ...
   FID: '$Id: nhttpd v0.6 2025-04-22 01:13:01 +0200 .m0rph $',

   GID: 1000,  // Unprivilleged runtime group
   UID: 1000,  // Unprivilleged runtime user


   PROTO: 'http://',
   HOSTNAME: 'nhttpd.js',
   HOST: '0.0.0.0',
   PORT: 80,

   DEV:       !!1,   // development status
   DEBUG:     !!0,   // Some debugging flags
   HEADERS:   !!0,
   REQUEST:   !!0,
   BLOGINDEX: !!0,
   CLIENT_ERRORS: !!0,

   ROOT: root,
   JSON: path.join(root, 'json'),
   PAYLOADS: path.join(root, 'payloads'),
   CONTROLLER: path.join(root, 'controller'),
   COLLECTIONS: path.join(root, 'collections'),
   CONTACT: path.join(root, 'contact'),
   VIEWS: path.join(root, 'views'),
   LOG: path.join(root, 'log'),

   TWITTER_CARD: 'summary',
   TWITTER_CARD_CREATOR: '@m0rphisto',
   TWITTER_CARD_IMAGE: 'https://m0rphisto.net/img/m0rph.400x400.png',
   TWITTER_CARD_IMAGE_ALT: '.m0rph@work',

   EMAIL_ADDRESS: 'webmaster@m0rphisto.net',

   BLOG_INDEX_NUM_POSTS: 5,

   // Objects and variables used and modified during runtime.
   postData: {},     // incoming POST data responses, etc.
   httpHeaders: {},  // incoming HTTP headers
   ipaddr: 'NO IP'   // client IP address
}
// EOF
