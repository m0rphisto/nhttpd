/**
 * $Id: 404.js 2025-04-10 12:50:14 +0200 .m0rph $
 */

const
   cfg  = require('../../config'),
   Load = require('../../lib/Loader'),
   Template = require('../../lib/Template');

const { sprintf } = require('sprintf-js');
const path = require('node:path');
const fs = require('node:fs');


const getdate = (view) => {
   const date = new Date(fs.statSync(view).mtime);
   return sprintf(
      '%d-%02d-%02d %02d:%02d:%02d',
         date.getFullYear(), date.getMonth() + 1, date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()
   );
}

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {

   // First thing to to is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': '404 - File not found',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'Burp Suite, in the ever-evolving landscape of web security, having the right tools is paramount. Burp Suite, a powerful web application security testing toolkit ...',
      'META_KEYWORDS': 'linux,debian,kali,network,web site security,burp suite,penetration testing,wen application security,vulnerabilities,pentesting',
      'DEFAULTCSS': 'default',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'MENUCSS': 'menu',
      'NAVICSS': Load.view('meta/navi-css.html'),
   });
   view = Load.view('meta/error.html');
   const errmsg = Template.parse(view, {
      'TIMESTAMP': getdate(path.join(cfg.ROOT, 'views', 'meta', 'error.html'))
   });

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'NAVIHTML': Load.view('meta/menu.html'),
      'ERROR_MESSAGE': '404 - Document not found.',
      'BOX_CONTACT_DATA': Load.view('meta/box.contact-data.html'),
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}