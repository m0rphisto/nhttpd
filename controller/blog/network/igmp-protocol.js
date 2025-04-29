/**
 * $Id: igmp-protocol.js 2025-04-22 15:27:56 +0200 .m0rph $
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   Template = require('@lib/Template');

const path = require('node:path');
const fs = require('node:fs');

const {CommonLib} = require('@lib/Common');

const cl = new CommonLib();


/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {

   const
      [urlpath, file] = ['blog/network', 'igmp-protocol'],
      text = 'Worth%20a%20Read:';
   const
      url = `${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/${file}`;
   
   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'IGMP Protocol',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'The IGMP protocol enables the one-to-many or many-to-many communication on the network. Data is sent from one source to multiple destinations simultanously.',
      'META_KEYWORDS': 'linux,debian,kali,network,protocol,igmp,multicast communication,optimize bandwidth,membership reports,query messages,leave messages,multicast traffic,scalability',
      'DEFAULTCSS': 'blog',

      'HEADER_OG_URL': url,
      'HEADER_OG_IMAGE': '/img/dall-e.20250422.the-power-of-multicast-communication.1098x627.png',
      'HEADER_OG_IMAGE_ALT': 'The Power of Multicast Communication',
      'HEADER_OG_TYPE': 'article',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_SITE': cfg.TWITTER_CARD_SITE,
      'TWITTER_CARD_IMAGE': '/img/dall-e.20250422.the-power-of-multicast-communication.1098x627.png',
      'TWITTER_CARD_IMAGE_ALT': 'The Power of Multicast Communication',

      'MENUCSS': 'menu',
      'NAVICSS': cl.loadView('meta/navi-css.html'),
   });
   view = cl.loadView('blog/network/igmp-protocol.html');
   const title = cl.getTitle(view);
   const article = Template.parse(view, {
      'SECTION': `<a href="${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/">Network</a>`,
      'POSTED': cl.getDate('birthtime', path.join(cfg.ROOT, 'views', 'blog', 'network', 'igmp-protocol.html')),
      'UPDATED': cl.getDate('mtime', path.join(cfg.ROOT, 'views', 'blog', 'network', 'igmp-protocol.html')),
      'SOCIALS': Template.parse(cl.loadView('meta/box.socials.html'), {
         'SHARE_LINKEDIN': `url=${url}`,
         'SHARE_X': `url=${url}&text=${text}%20${title}`,
         'SHARE_MASTODON': `text=${text}%20${title}%20${url}`,
         'SHARE_REDDIT': `url=${url}&title=${text}%20${title}`,
      })
   });

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'ARTICLE_BOX': article,
      'FOOTER': cl.loadView('meta/footer.html'),
      'FID': cfg.FID,
   }
}
