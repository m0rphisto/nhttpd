/**
 * $Id: whoami.js.js 2025-04-26 05:53:30 +2100 .m0rph $
 * 
 * About page form controller
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   {CommonLib} = require('@lib/Common'),
   Template = require('@lib/Template');

const cl = new CommonLib();


const ctrltest = () => {
   return 'document.querySelector("#controller-test").innerHTML = "Social media and FOSS profile."';
}

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to to is building the HTML header setting the meta data
   let view = cl.loadView('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'Who am I ...',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': 'Hey there. I\'m .m0rph, a software developer and computer geek. My first home computer as a little boy was an ATARI 800XL. In 1987 at the age of 16 I started programming BASIC and built my first bitmaps using PEEKs and POKEs.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites,atari 800xl,sun,oracle,solaris,sinix,xenix,quantum,turbo pascal,basic,cobol',

      'HEADER_OG_URL': `${cfg.PROTO}${cfg.HOSTNAME}/`,
      'HEADER_TITLE':  'Who am I ...',
      'META_DESCRIPTION': 'Hey there. I\'m .m0rph, a software developer and computer geek. My first home computer as a little boy was an ATARI 800XL. In 1987 at the age of 16 I started programming BASIC and built my first bitmaps using PEEKs and POKEs.',
      'HEADER_OG_IMAGE': '/img/ethical-hacking.png',
      'HEADER_OG_IMAGE_ALT': 'Me!? I am an ethical hacker.',
      'HEADER_OG_TYPE': 'website',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'DEFAULTCSS': 'default',
      'MENUCSS': 'menu'
   });
   

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'FOOTER': cl.loadView('meta/footer.html'),
      'FID': cfg.FID,
   }
}
