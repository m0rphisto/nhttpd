/**
 * $Id: config.js v0.3 2025-01-12 06:43:50 +0100 .m0rph $
 * 
 * This is the nhttpd configuration script.
 */

module.exports = {

   // Defaults ...
   FID: '$Id: nhttpd v0.2 2024-01-01 01:14:28 +0100 .m0rph $',

   PROTO: 'http://',
   HOSTNAME: 'nhttpd.js',
   HOST: '0.0.0.0',
   PORT: 8081,

   DEV:     !!1,   // development status
   DEBUG:   !!1,   // Some debugging flags
   HEADERS: !!0,
   CLIENT_ERRORS: !!1,

   ROOT: __dirname,

   TWITTER_CARD: 'summary',
   TWITTER_CARD_CREATOR: '@m0rphisto',
   TWITTER_CARD_IMAGE: 'https://m0rphisto.net/img/m0rph.400x400.png',
   TWITTER_CARD_IMAGE_ALT: '.m0rph@work',

   EMAIL_ADDRESS: 'webmaster@m0rphiso.net',

   BLOG_INDEX_NUM_POSTS: 3
}
// EOF
