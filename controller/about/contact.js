/**
 * $Id: contact.js 2025-04-26 06:05:21 +2100 .m0rph $
 * 
 * Contact form controller
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   {CommonLib} = require('@lib/Common'),
   Template = require('@lib/Template');

const cl = new CommonLib();

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'Wanna get in touch?',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites',

      'HEADER_OG_URL': `${cfg.PROTO}${cfg.HOSTNAME}/`,
      'HEADER_TITLE': 'Wanna get in touch?',
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'HEADER_OG_IMAGE': '/img/tux-talking.jpg',
      'HEADER_OG_IMAGE_ALT': 'Excuse me, do you have a moment to talk about Linux?',
      'HEADER_OG_TYPE': 'website',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'DEFAULTCSS': 'contact',
      'MENUCSS':  'menu'
   });

   let response = 'I will try to give you a response as soon as possible.';
   if (Object.hasOwn(cfg.postData, 'txt')) {
      // Whoop, whoop: The contact form has beed used. We have to respond!
      if (cfg.postData.code === '500') {
         response = `<b style="color: #f00">ERROR:</b> ${cfg.postData.txt}`;
      } else {
         response = cfg.postData.txt;
      }

      // And from here on, we do not need this data anymore,
      // so we reset the property.
      cfg.postData = {};
   }

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'RESPONSE': response,
      'FOOTER': cl.loadView('meta/footer.html'),
      'HOSTNAME': cfg.HOSTNAME,
      'FID': cfg.FID,
   }
}
