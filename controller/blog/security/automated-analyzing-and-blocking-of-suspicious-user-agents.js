/**
 * $Id: automated-analyzing-and-blocking-of-suspicious-user-agents-via-nftables.js 2025-04-27 05:31:25 +0200 .m0rph $
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
      [urlpath, file] = ['blog/security', 'automated-analyzing-and-blocking-of-suspicious-user-agents'],
      text = 'Worth%20a%20Read:';
   const
      url = `${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/${file}`;

   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'Automated Analyzing and Blocking of suspicious User-Agents',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'Every webmaster is analyzing his logfiles and searching for any suspicious entries in the vast amount of accessing clients to the server. We can automate that and directly configure the servers firewall to block all those attacking bots.',
      'META_KEYWORDS': 'linux,debian,kali,network,web site security,penetration testing,web application security,vulnerabilities,pentesting,firewall,nftables,bash,zsh,grep,sed,awk',
      'DEFAULTCSS': 'blog',

      'HEADER_OG_URL': url,
      'HEADER_OG_IMAGE': '/img/dall-e.20250427.automated-analyzing-and-blocking-of-suspicious-user-agents.940x627.png',
      'HEADER_OG_IMAGE_ALT': 'Automated Analyzing and Blocking of suspicious User-Agents',
      'HEADER_OG_TYPE': 'article',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_SITE': cfg.TWITTER_CARD_SITE,
      'TWITTER_CARD_IMAGE': '/img/dall-e.20250427.automated-analyzing-and-blocking-of-suspicious-user-agents.940x627.png',
      'TWITTER_CARD_IMAGE_ALT': 'Automated Analyzing and Blocking of suspicious User-Agents', 

      'MENUCSS': 'menu',
      'NAVICSS': cl.loadView('meta/navi-css.html'),
   });
   view = cl.loadView('blog/security/automated-analyzing-and-blocking-of-suspicious-user-agents.html');
   const title = cl.getTitle(view);
   const article = Template.parse(view, {
      'SECTION': `<a href="${cfg.PROTO}${cfg.HOSTNAME}/${urlpath}/">Security</a>`,
      'POSTED': cl.getDate('birthtime', path.join(cfg.ROOT, 'views', 'blog', 'security', 'automated-analyzing-and-blocking-of-suspicious-user-agents.html')),
      'UPDATED': cl.getDate('mtime', path.join(cfg.ROOT, 'views', 'blog', 'security', 'automated-analyzing-and-blocking-of-suspicious-user-agents.html')),
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
