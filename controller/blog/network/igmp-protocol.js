/**
 * $Id: the-igmp-protocol.js 2024-01-08 06:25:17 +0100 .m0rph $
 */

const
   cfg  = require('../../../config'),
   Load = require('../../../lib/Loader'),
   Template = require('../../../lib/Template');

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

   const url = cfg.ROOT + 'blog/network/igmp-protocol.html';
   
   // First thing to to is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'IGMP Protocol',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'The IGMP protocol enables the one-to-many or many-to-many communication on the network. Data is sent from one source to multiple destinations simultanously.',
      'META_KEYWORDS': 'linux,debian,kali,network,protocol,igmp,multicast communication,optimize bandwidth,membership reports,query messages,leave messages,multicast traffic,scalability',
      'DEFAULTCSS': 'blog',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'MENUCSS': 'menu',
      'NAVICSS': Load.view('meta/navi-css.html'),
   });
   view = Load.view('blog/network/igmp-protocol.html');
   const article = Template.parse(view, {
      //'DATE_POSTED': path.join(cfg.ROOT, 'views', 'blog', 'network', 'igmp-protocol.html')
      'DATE_POSTED': getdate(path.join(cfg.ROOT, 'views', 'blog', 'network', 'igmp-protocol.html'))
   });
        //return sprintf('%d-%02d-%02d', date.getFullYear(), date.getMonth() + 1, date.getDate());
        //return sprintf('%02d:%02d:%02d', date.getHours(), date.getMinutes(), date.getSeconds());

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'MENU': Load.view('meta/menu.html'),
      'ARTICLE': article,
      'NAVIGATION': 'NAVIGATION',
      'BOX_CONTACT_DATA': Load.view('meta/box.contact-data.html'),
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}
