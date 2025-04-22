/**
 * $Id: Template.js 2025-04-18 20:37:55 +0200 .m0rph $
 *
 * HTML Template Parser
 */

'use strict';

const path = require('node:path');
const cfg  = require('@lib/Config');
const Load = require('@lib/Loader');


/**
 * 
 * @param {string} data The HTML document 
 * @returns {string} The footer finalized document
 */
const copyright = (data) => {
   //let out = data.replace(/{WEBMASTER}/g, 'm0rphisto.net@gmail.com');
   let out = data.replace(/{WEBMASTER}/g, cfg.EMAIL_ADDRESS);
   return out.replace(/{COPYRIGHT}/g, `2006&nbsp;\u3192&nbsp;${new Date().getFullYear()}`);
}


/**
 * Public: We need to send the correct MIME type. 
 * @param {string} url The URL of the requested file
 * @returns {string} MIME type
 */
exports.mime = (url) => {
   if      (url.match('.html$')) return 'html';
   else if (url.match('.css$'))  return 'css';
   else if (url.match('.js$'))   return 'js';
   else if (url.match('.json$')) return 'json';
   else if (url.match('.jpg$'))  return 'jpg';
   else if (url.match('.png$'))  return 'png';
   else if (url.match('.gif$'))  return 'gif';
   else                          return 'txt';
}

/**
 * Public: The menu builder
 * @param   {object} data The HTML template
 * @returns {string} out  The finished dropdown menu
 */
exports.menu = (data) => {
   let [net, sec, out] = ['', '', copyright(data.toString())]; // Convert to String object !!!
   const space = '                  '; // Only for better HTML formatting
   const blogFiles = Load.json('BlogFiles.json')
   const menu = Load.view('meta/menu.html');

   for (const key of Object.keys(blogFiles)) {
      if (key.startsWith('/blog/network'))
         net += `${space}<li><a href="${key}" title="${blogFiles[key]['title']}">${blogFiles[key]['text']}</a>\n`;
      if (key.startsWith('/blog/security'))
         sec += `${space}<li><a href="${key}" title="${blogFiles[key]['title']}">${blogFiles[key]['text']}</a>\n`;
   }
   out = out.replace(`{BLOG_ETC_NETWORK}`, net);
   out = out.replace(`{BLOG_VAR_LOG}`, sec);
   return out;
}

/**
 * Public: The breadcrumbs builder
 * @param   {string} url  The URL of the actual page
 * @param   {object} data The breadcrumb box template
 * @returns {string} out  The finished breadcrumb line
 */
exports.breadcrumbs = (url, data) => {
   let [crumb, links] = ['', ''];
   let [regex, out] = ['', copyright(data.toString())]; // Convert to String object !!!
   if (url != '/') {
      // OK, we're NOT at the Home page ...
      if (url.startsWith('/about')) {
         // ... but this section here is fix. We don't need to split anything.
         const paths = {
            '/about/whoami': 'Who am I',
            '/about/business': 'Business',
            '/about/contact': 'Contact',
         };
         links = `&nbsp;|&nbsp;${paths[url]}`;
      } else if (url.startsWith('/blog')) {
         const blogFiles = Load.json('BlogFiles.json');
         if (url.endsWith('/') && (url.match(/\//g) || []).length > 2) {
            // We're on a blog section index, so we need to set a breadcrumb back to 
            // the first blog index 'Recent Posts'.
            regex = /^(\/.*?\/).*?\/$/; url.match(regex);
            crumb = RegExp.$1;
            // blogFiles[url]['text'].substring(8) is deleting decimal symbol codes
            links += `&nbsp;|&nbsp;<a href="${crumb}" title="${blogFiles[crumb]['title']}">${blogFiles[crumb]['text'].substring(8)}</a>`;
            links += `&nbsp;|&nbsp;${blogFiles[url]['text'].substring(8)}`;
         } else if (url.endsWith('/')) {
            // We're on the first blog index, so we only need the link text and that's it.
            links = `&nbsp;|&nbsp;${blogFiles[url]['text'].substring(8)}`;
         } else {
            // We're on a blog entry, so at first we have to split the URL and 
            // set breadcrumbs to the 'Recent Posts' page and its own section index.
            regex = /^((\/.*?\/).*?\/).*$/; url.match(regex);
            /*************************************************************
             * The inner parantheses is $2 and the outer ones are $1 !!! *
             * /^(     (\/.*?\/).*?\/).*$/; !!! NOT TO FORGET !!!        *
             *   ^--$1 ^--$2                                             *
             *************************************************************
             */
            crumb = RegExp.$2; // Recent Posts
            links += `&nbsp;|&nbsp;<a href="${crumb}" title="${blogFiles[crumb]['title']}">${blogFiles[crumb]['text'].substring(8)}</a>`;
            crumb = RegExp.$1; // Own blog section
            links += `&nbsp;|&nbsp;<a href="${crumb}" title="${blogFiles[crumb]['title']}">${blogFiles[crumb]['text'].substring(8)}</a>`;
            links += `&nbsp;|&nbsp;${blogFiles[url]['text'].substring(8)}`;
         }
      }
   }
   return out.replace(`{CRUMBLINKS}`, links);
}

/**
 * Public: The HTML template parser
 * @param {string} data The HTML template
 * @param {object} tmplvars The template variables that have to be replaced
 * @returns {string} The finished HTML document.
 */
exports.parse = (data, tmplvars) => {
   let out = copyright(data.toString()); // Convert to String object !!!
   for (const [key, val] of Object.entries(tmplvars)) {
      out = out.replaceAll(`{${key}}`, val); // or we cannot RegEx !!!
   }
   return out;
}

/**
 * Public: Final variable cleaner. Delete all unused template variables.
 * 
 * @param   {string} data  The HTML template
 * @returns {string}       The cleaned HTML document
 */
exports.finalize = (data) => {
   return data.replaceAll(/{[A-Z0-9_]*}/g, '');
}
