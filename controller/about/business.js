/**
 * $Id: whoami.js.js 2025-04-17 21:29:17 +0200 .m0rph $
 * 
 * About page form controller
 */

'use strict';

const
   cfg  = require('@lib/Config'),
   Load = require('@lib/Loader'),
   Template = require('@lib/Template');


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
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'My first own business ...',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION':  'In 2006 I founded my first business, developing websites, hosting them on my dedicated server, auditing and managing partner and customer\'s servers.'.
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites,root,dedicated,servers,VPS,administration,php,mysql,perl,postgresql,joomla,modules,plugins,extensions,ninjaforge,plesk,cpanel,openssh,suid',

      'HEADER_OG_URL': `${cfg.PROTO}${cfg.HOSTNAME}/`,
      'HEADER_TITLE': 'My first own business ...',
      'META_DESCRIPTION': 'In 2006 I founded my first business, developing websites, hosting them on my dedicated server, auditing and managing partner and customer\'s servers.'.
      'HEADER_OG_IMAGE': '/img/ssh-tux.jpg',
      'HEADER_OG_IMAGE_ALT': 'Server sided...',
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
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}
