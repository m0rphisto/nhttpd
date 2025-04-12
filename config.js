/**
 * $Id: config.js v0.3 2025-01-12 06:43:50 +0100 .m0rph $
 * 
 * This is the nhttpd configuration script.
 */

module.exports = {

   // Defaults ...
   FID: '$Id: nhttpd v0.3 2025-04-10 17:21:54 +0200 .m0rph $',

   PROTO: 'http://',
   HOSTNAME: 'nhttpd.js',
   HOST: '127.0.0.1',
   PORT: 80,

   DEV:       !!1,   // development status
   DEBUG:     !!1,   // Some debugging flags
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
