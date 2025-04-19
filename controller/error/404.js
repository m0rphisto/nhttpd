/**
 * $Id: 404.js 2025-04-17 21:31:17 +0200 .m0rph $
 */

const
   cfg  = require('../../config'),
   Load = require('../../lib/Loader'),
   Template = require('../../lib/Template');



/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {

   // First thing to do is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': '404 - File not found',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'Burp Suite, in the ever-evolving landscape of web security, having the right tools is paramount. Burp Suite, a powerful web application security testing toolkit ...',
      'META_KEYWORDS': 'linux,debian,kali,network,web site security,burp suite,penetration testing,wen application security,vulnerabilities,pentesting',
      'DEFAULTCSS': 'blog',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'MENUCSS': 'menu',
      'NAVICSS': Load.view('meta/navi-css.html'),
   });
   view = Load.view('meta/box.error.html');
   const errmsg = Template.parse(view, {
      'ERROR_MESSAGE': '404 - Document not found'
   });

   return {
      // Finally replace the template variables and return the document
      'HEADER': header,
      //'NAVIGATION': Load.view('meta/box.ip-address.html'),
      'ARTICLE_BOX': errmsg,
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}
