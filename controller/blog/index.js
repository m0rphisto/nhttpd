/**
 * $Id: index.js 2025-04-18 19:11:38 +0200 .m0rph $
 */

'use strict';

const
   fs = require('node:fs'),
   path = require('node:path'),
   cfg  = require('@lib/Config'),
   Template = require('@lib/Template');

// Load classes
const {CommonLib} = require('@lib/Common');

// Instantiate classes
const cl = new CommonLib();

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to do is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': '.m0rph\'s blog :: Recent Posts',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites',
      'DEFAULTCSS': 'blog',

      'HEADER_OG_URL': `${cfg.PROTO}${cfg.HOSTNAME}/blog/`,
      'HEADER_OG_IMAGE': '/img/tux-talking.jpg',
      'HEADER_OG_IMAGE_ALT': 'Excuse me, do you have a moment to talk about Linux?',
      'HEADER_OG_TYPE': 'website',
      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'MENUCSS': 'menu',
      'NAVICSS': cl.loadView('meta/navi-css.html'),
   });

   let posts = [];
   const template = cl.loadView('meta/box.blog-article.html');
   const files = cl.getFiles(path.join(cfg.ROOT, 'views', 'blog'));
   files.sort((a, b) => {return b.mtime - a.mtime}); // b - a := sort descending (otherwise a - b)
   const max = (files.length < cfg.BLOG_INDEX_NUM_POSTS) ? files.length : cfg.BLOG_INDEX_NUM_POSTS;
   for (let i = 0; i < max; i++) {
      let box = template;
      const article = cl.getSnippets(cl.loadView(files[i].file));
      posts[i] = Template.parse(box, {
         'ARTICLE_URL': files[i].article_url,
         'ARTICLE_HEADER': article.header,
         'SECTION_HREF': files[i].section_href,
         'SECTION_TXT': files[i].section_txt,
         'IMG_SRC': files[i].img_src,
         'IMG_ALT': files[i].img_alt,
         'IMG_SOURCE': files[i].img_source,
         'PARAGRAPH': article.text,
         'POSTED': files[i].btime,
         'UPDATED': files[i].mtime
      });
   }
   let posting, recent_articles = '';
   while (posting = posts.shift()) {
      recent_articles += `${posting}\n`;
   }
   // No more needed, so free memory.
   files.length = 0;

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'INDEX_BOXES': recent_articles,
      'FOOTER': cl.loadView('meta/footer.html'),
      'FID': cfg.FID,
   }
}
