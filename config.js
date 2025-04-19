/**
 * $Id: config.js v0.4 2025-01-13 19:00:54 +0200 .m0rph $
 * 
 * This is the nhttpd configuration script.
 */

module.exports = {

   // Defaults ...
   FID: '$Id: nhttpd v0.5 2025-04-17 12:42:20 +0200 .m0rph $',

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
   CLIENT_ERRORS: !!1,

   ROOT: __dirname,

   TWITTER_CARD: 'summary',
   TWITTER_CARD_CREATOR: '@m0rphisto',
   TWITTER_CARD_IMAGE: 'https://m0rphisto.net/img/m0rph.400x400.png',
   TWITTER_CARD_IMAGE_ALT: '.m0rph@work',

   EMAIL_ADDRESS: 'webmaster@m0rphisto.net',

   BLOG_INDEX_NUM_POSTS: 5
}
// EOF
