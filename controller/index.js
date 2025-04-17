/**
 * $Id: index.js v0.3 2025-04-17 21:26:48 +0200 .m0rph $
 */

const
   cfg  = require('../config'),
   Load = require('../lib/Loader'),
   Template = require('../lib/Template');


//const ctrltest = () => {
   //return 'document.querySelector("#controller-test").innerHTML = "Social media and FOSS profiles."';
//}

/**
 * Public: Builds the document built, loading views and returning 
 * template key/value pairs for the Template object.
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to to is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': 'Hello Node.js World!',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites',
      
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
