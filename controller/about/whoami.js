/**
 * $Id: whoami.js.js 2024-01-08 01:16:12 +0100 .m0rph $
 * 
 * About page form controller
 */

const
   cfg  = require('../../config'),
   Load = require('../../lib/Loader'),
   Template = require('../../lib/Template');


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
      'HEADER_TITLE': 'Who am I ...',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites,atari 800xl,sun,oracle,solaris,sinix,xenix,quantum,turbo pascal,basic,cobol',

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
      'NAVIHTML': Load.view('meta/menu.html'),
      'BOX_CONTACT_DATA': Load.view('meta/box.contact-data.html'),
      'CONTROLLER_TEST': ctrltest(),
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}