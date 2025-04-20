/**
 * $Id: sso-otp-understanding-onetime-passwords.js 2025-04-18 11:23:40 +0200 .m0rph $
 */

const
   cfg  = require('../../../config'),
   Load = require('../../../lib/Loader'),
   Template = require('../../../lib/Template');

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
   //return title.replaceAll(regex, '%20');
}

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {

   const
      [urlpath, file] = ['blog/security', 'sso-otp-understanding-onetime-passwords'],
      text = 'Worth%20a%20Read:';
   const
      url = `${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/${file}`;

   // First thing to to is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'IGMP Protocol',
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
   view = Load.view(`${urlpath}/${file}.html`);
   const title = getTitle(view);
   const article = Template.parse(view, {
      'SECTION': `<a href="${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/">Security</a>`,
      'POSTED': getdate('birthtime', path.join(cfg.ROOT, 'views', 'blog', 'security', `${file}.html`)),
      'UPDATED': getdate('mtime', path.join(cfg.ROOT, 'views', 'blog', 'security', `${file}.html`)),
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
