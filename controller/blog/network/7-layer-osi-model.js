/**
 * $Id: 7-layer-osi-model.js 2025-04-17 21:34:10 +0200 .m0rph $
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   Load = require('@lib/Loader'),
   Template = require('@lib/Template');

const { sprintf } = require('sprintf-js');
const path = require('node:path');
const fs = require('node:fs');


/**
 * Private: Gets the given timestamp for the blog article's view.
 *
 * @param   {string} mode  Timestamp mode (btime/mtime)
 * @param   {string} view  The blog view
 * @returns {string} date  The formatted timestamp
 */
const getdate = (mode, view) => {
   const date = fs.statSync(view)[mode];
   return sprintf(
      '%d-%02d-%02d %02d:%02d:%02d',
         date.getFullYear(), date.getMonth() + 1, date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()
   );
}

/**
 * Private: Gets the blog article's title
 *
 * @param   {string} post  The blog view
 * @returns {string} title The blog article's title
 */
const getTitle = (post) => {
   /<h1 aria-label="header">(.*?)<\/h1>/.exec(post);
   const title = RegExp.$1;
   const regex = /\s/g;
   return (RegExp.$1).replaceAll(regex, '%20');
}


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
   let view = Load.view('meta/header.html');
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
      'NAVICSS': Load.view('meta/navi-css.html'),
   });
   view = Load.view('blog/network/7-layer-osi-model.html');
   const title = getTitle(view);
   const article = Template.parse(view, {
      'SECTION': `<a href="${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/">Network</a>`,
      'POSTED': getdate('birthtime', path.join(cfg.ROOT, 'views', 'blog', 'network', '7-layer-osi-model.html')),
      'UPDATED': getdate('mtime', path.join(cfg.ROOT, 'views', 'blog', 'network', '7-layer-osi-model.html')),
      'SOCIALS': Template.parse(Load.view('meta/box.socials.html'), {
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
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}
