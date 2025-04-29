/**
 * $Id: index.js 2025-04-26 05:52:18 +0200 .m0rph $
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   {CommonLib} = require('@lib/Common'),
   Template = require('@lib/Template');

const cl = new CommonLib();

/**
 * Public: Builds the document built, loading views and returning 
 * template key/value pairs for the Template object.
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'Hello Node.js World!',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites',
      
      'HEADER_OG_URL': `${cfg.PROTO}${cfg.HOSTNAME}/`,
      'HEADER_TITLE': 'Hello Node.js World!',
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'HEADER_OG_IMAGE': '/img/tux-talking.jpg',
      'HEADER_OG_IMAGE_ALT': 'Excuse me, do you have a moment to talk about Linux?',
      'HEADER_OG_TYPE': 'website',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'DEFAULTCSS': 'default',
      'MENUCSS': 'menu',
   });


   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'FOOTER': cl.loadView('meta/footer.html'),
      'FID': cfg.FID,
   }
}
