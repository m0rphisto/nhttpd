/**
 * $Id: index.js 2025-04-12 10:43:22 +0200 .m0rph $
 */

const
   fs = require('node:fs'),
   path = require('node:path'),
   {sprintf} = require('sprintf-js'),
   cfg  = require('../../config'),
   Load = require('../../lib/Loader'),
   Template = require('../../lib/Template');


/**
 * Private: Controller checkup. 
 * @param   {string}  file The blogentriy view which also needs a controller.
 * @returns {boolean}      true: controller, false: no controller 
 */
const hasController = (file) => {
   const views = `${path.sep}views${path.sep}`
   file = file.replace(views, `${path.sep}controller${path.sep}`);
   file = file.replace(/html$/, 'js');
   return (fs.existsSync(file)) ? !!1 : !!0;
}

/**
 * Private: Recursive blog entry search. 
 * @param {string} dir The root directory for a recursive file search
 * @returns {array} The files list
 */
const getFiles = (dir) => {
   let files = []; // dir should be: cfg.ROOT{DIRSEP}views{DIRSEP}blog
   const list = fs.readdirSync(dir);
   list.forEach(file => {
      file = dir + path.sep + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
         // Recurse to subdir
         files = files.concat(getFiles(file));
      } else if (! hasController(file)) {
         // While writing a new blog entry, it is possible that the view doesn't
         // have a controller yet. So we do not need to list it!
         return;
      } else {
         // (?<!negative-look-behind)
         if (file.match(/(?<!index)\.html$/)) {
            const s = (path.sep === '\\') ? '\\\\' : '/'; // FUCKING backslash :-D
            const regex_post = new RegExp(s+'(blog'+s+'.*?'+s+'.*?\.html)$');
            const regex_sect = new RegExp(s+'blog'+s+'(.*?)'+s);
            const regex_url  = new RegExp(s+'blog'+s+'.*?'+s+'(.*?)\.html$');
            regex_post.exec(file); const post = (RegExp.$1).replaceAll('\\', '/'); // And the Node.js module loader
            regex_sect.exec(file); const sect = RegExp.$1;                         // doesn't care for \ oder / 
            regex_url.exec(file);  const url  = RegExp.$1;
            //console.log(`file(${file}),\nsect(${sect}),\nurl(${url}),\npost(${post})\n\n`)
            files.push({
               file: post,
               mtime: stat.mtime.getTime(),
               article_url: `/blog/${sect}/${url}`,
               section_href: `/blog/${sect}/`,
               section_txt: sect.charAt(0).toUpperCase() + sect.slice(1)
            });
            if (cfg.DEBUG && cfg.BLOGINDEX) console.log(files);
         }
      }
   });
   return files;
}

const getSnippets = (post) => {
   const snippets = [{header: '', text: ''}];
   /<h1 aria-label="header">(.*?)<\/h1>/.exec(post);
   snippets.header = RegExp.$1;
   /<p aria-label="text">(.*?)<\/p>/.exec(post);
   snippets.text = RegExp.$1;
   return snippets;
}

/**
 * Public: Returns the template key/value pairs
 * 
 * @returns {object}
 */
exports.data = () => {
   
   // First thing to do is building the HTML header setting the meta data
   let view = Load.view('meta/header.html');
   const header = Template.parse(view, {
      'HEADER_TITLE': '.m0rph\'s blog :: Landingpage',
      'HOSTNAME': cfg.HOSTNAME,
      'META_DESCRIPTION': cfg.HOSTNAME + ' is an educational Node.js project and blog, covering topics such as Linux and its administration, zsh scripting, software and website development, JavaScript, Node.js, but also networks and the navigation on the highway of Bits and Bytes.',
      'META_KEYWORDS': 'm0rphisto,.m0rph,linux,debian,kali,blog,wiki,development,webdevelopment,html,css,purecss,javascript,node.js,framework,runtime,json,hacking,exploits,penetration testing,websites',
      'DEFAULTCSS': 'blog',

      'TWITTER_CARD': cfg.TWITTER_CARD,
      'TWITTER_CARD_CREATOR': cfg.TWITTER_CARD_CREATOR,
      'TWITTER_CARD_IMAGE': cfg.TWITTER_CARD_IMAGE,
      'TWITTER_CARD_IMAGE_ALT': cfg.TWITTER_CARD_IMAGE_ALT,

      'MENUCSS': 'menu',
      'NAVICSS': Load.view('meta/navi-css.html'),
   });

   let posts = [];
   const template = Load.view('meta/box.blog-article.html');
   const files = getFiles(path.join(cfg.ROOT, 'views', 'blog'));
   files.sort((a, b) => {return b.mtime - a.mtime}); // b - a := sort descending (otherwise a - b)
   const max = (files.length < cfg.BLOG_INDEX_NUM_POSTS) ? files.length : cfg.BLOG_INDEX_NUM_POSTS;
   for (let i = 0; i < max; i++) {
      let box = template;
      const article = getSnippets(Load.view(files[i].file));
      const date = new Date(files[i].mtime);
      const mtime = sprintf(
         '%d-%02d-%02d %02d:%02d:%02d',
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds()
      );
      posts[i] = Template.parse(box, {
         'ARTICLE_URL': files[i].article_url,
         'ARTICLE_HEADER': article.header,
         'SECTION_HREF': files[i].section_href,
         'SECTION_TXT': files[i].section_txt,
         'PARAGRAPH': article.text,
         'TIMESTAMP': mtime
      });
   }
   let post, blog_articles = '';
   while (post = posts.shift()) {
      blog_articles += `${post}\n`;
   }
   // No more needed, so free memory.
   files.length = 0;

   return {
      // Finally return replace the template variables and return the document
      'HEADER': header,
      'MENU': Load.view('meta/menu.html'),
      'NAVIGATION': 'NAVIGATION',
      'BLOG_ARTICLES': blog_articles,
      'BOX_CONTACT_DATA': Load.view('meta/box.contact-data.html'),
      'FOOTER': Load.view('meta/footer.html'),
      'FID': cfg.FID,
   }
}
