/**
 * $Id: 7-layer-osi-model.js 2025-04-17 21:34:10 +0200 .m0rph $
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
      [urlpath, file] = ['blog/network', '7-layer-osi-model'],
      text = 'Worth%20a%20Read:';
   const
      url = `${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/${file}`;
   
   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'ISO/OSI Model',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'A Comprehensive Guide to the 7-Layer OSI Model. The OSI (Open Systems Interconnection) model stands as a foundational framework that facilitates seamless communication between devices and systems.',
      'META_KEYWORDS': 'linux,debian,kali,network,protocol,iso,7 layer,physical layer,data Link layer,network layer,transport layer,session layer,presentation layer,application layer,',
      'DEFAULTCSS': 'blog',

      'HEADER_OG_URL': url,
      'HEADER_OG_IMAGE': '/img/dall-e.20250422.a-guide-to-the-7-layer-osi-model.1098x627.png',
      'HEADER_OG_IMAGE_ALT': 'A Guide to the 7-Layer OSI Model',
      'HEADER_OG_TYPE': 'article',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_SITE': cfg.TWITTER_CARD_SITE,
      'TWITTER_CARD_IMAGE': '/img/dall-e.20250422.a-guide-to-the-7-layer-osi-model.1098x627.png',
      'TWITTER_CARD_IMAGE_ALT': 'A Guide to the 7-Layer OSI Model',

      'MENUCSS': 'menu',
      'NAVICSS': cl.loadView('meta/navi-css.html'),
   });
   view = cl.loadView('blog/network/7-layer-osi-model.html');
   const title = cl.getTitle(view);
   const article = Template.parse(view, {
      'SECTION': `<a href="${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/">Network</a>`,
      'POSTED': cl.getDate('birthtime', path.join(cfg.ROOT, 'views', 'blog', 'network', '7-layer-osi-model.html')),
      'UPDATED': cl.getDate('mtime', path.join(cfg.ROOT, 'views', 'blog', 'network', '7-layer-osi-model.html')),
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
