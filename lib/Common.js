/**
 * $Id: Common.js 2025-04-27 05:40:29 +0200 .m0rph $
 *
 * nhttpd common lib
 */

'use strict';

// Needed for the logfiles
const {Console} = require('node:console');
const {sprintf} = require('sprintf-js');
const
   fs = require('node:fs'),
   path = require('node:path'),
   cfg = require('@lib/Config');


class CommonLib {

   constructor() {
      this.name = 'CommonLib';
      this.files = {
         // The http.server module uses lower case !!!
         'user-agent': 'user-agents',
         'accep-language': 'accepted-languages',
         'cache-control': 'cache-controls',
         'referer': 'referers',
         'dnt': 'do-not-track'
      };
      this.logger = new Console({
         // Prepare log message printing
         stdout: fs.createWriteStream(
            path.join(cfg.LOG, 'access.log'), { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' }
         ),
         stderr: fs.createWriteStream(
            path.join(cfg.LOG, 'error.log'),  { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' }
         )
      });
   }

   /////////////////////////////////////////////////////////////////////////////
   // DateTime
   /////////////////////////////////////////////////////////////////////////////

   d = {
      now () { return new Date() },
      date () {
         let date = this.now();
         //let date = exports.d.now();
         return sprintf('%d-%02d-%02d', date.getFullYear(), date.getMonth() + 1, date.getDate());
      },
      time () {
         let date = this.now();
         return sprintf('%02d:%02d:%02d', date.getHours(), date.getMinutes(), date.getSeconds());
      },
      timestamp () {
         let date = this.now();
         return sprintf('%d%02d%02d-%02d%02d%02d',
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds()
         );
      }
   }

   /////////////////////////////////////////////////////////////////////////////
   // Logger
   /////////////////////////////////////////////////////////////////////////////

   log (stat, ip, msg) {
      const str = `[${this.d.date()} ${this.d.time()}] ${ip} - ${msg}`;
      const stream = (stat == 0) ? 'log' : 'error';
      this.logger[stream](str);
   }

   collect (type, ip, data) {
      if (type in this.files) {
         fs.appendFileSync(
            path.join(cfg.COLLECTIONS, `${this.files[type]}.txt`),
            `[${this.d.date()} ${this.d.time()}] ${ip} ${data}\n`,
            { encoding: 'utf8', mode: 0o0640 }
         );
      }
   }

   /////////////////////////////////////////////////////////////////////////////
   // Loader
   /////////////////////////////////////////////////////////////////////////////

   /**
    * Private: Loads the JSON menu configuration or HTML template file
    * 
    * @returns {object} The JSON menu object.
    */
   load (file) {
      return fs.readFileSync(file, { encoding: 'utf-8'}, (err, data) => {
         if (err) {
            cl.log(1, 'ERROR', `Could not load file ${file}`);
            console.log(`[ERROR] Could not load file ${file}`);
            return '{"error": "Could not load file'+file+'"}';
         }
         else
            return data;
      });
   }

   /**
    * Public: Returns a JavaSript object from the loaded JSON file.
    * 
    * @returns {string} The JavaSript object
    */
   loadJson (file) {
      return JSON.parse(this.load(path.join(cfg.JSON, file)));
   }

   /**
    * Public: Returns an XML file.
    * 
    * @param   {string} file The filename to get
    * @returns {string}      The XML data
    */
   loadXml (file) {
      return this.load(path.join(cfg.XML, file));
   }

   /**
    * Public: Returns the HTML template.
    * 
    * @returns {string} The menu template
    */
   loadView (file) {
      return this.load(path.join(cfg.VIEWS, file));
   }


   /////////////////////////////////////////////////////////////////////////////
   // Controller
   /////////////////////////////////////////////////////////////////////////////

   /**
    * Private: Controller checkup for the blog section index pages. 
    * @param   {string}  file The blogentry view which also needs a controller.
    * @returns {boolean}      true: controller, false: no controller 
    */
   hasController (file) {
      const views = `${path.sep}views${path.sep}`
      file = file.replace(views, `${path.sep}controller${path.sep}`);
      file = file.replace(/html$/, 'js');
      return (fs.existsSync(file)) ? !!1 : !!0;
   }


   /**
    * Public: Gets the given timestamp for a blog article's view.
    *
    * @param   {string} mode  Timestamp mode (btime/mtime)
    * @param   {string} view  The blog view
    * @returns {string} date  The formatted timestamp
    */
   getDate (mode, view) {
      const date = fs.statSync(view)[mode];
      return sprintf(
         '%d-%02d-%02d %02d:%02d:%02d',
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds()
      );
   }

   /**
    * Public: Gets the blog article's title on the article pages.
    *
    * @param   {string} post  The blog view
    * @returns {string} title The blog article's title
    */
   getTitle (post) {
      /<h1 aria-label="header">(.*?)<\/h1>/.exec(post);
      const title = RegExp.$1;
      const regex = /\s/g;
      return (RegExp.$1).replaceAll(regex, '%20');
   }

   /**
    * Public: Gets the blog article's title and preface on the blog section index pages.
    * @param   {string} post     The content of the blog article
    * @returns {object} snippets The title and preface
    */
   getSnippets (post) {
      const snippets = [{header: '', text: ''}];
      /<h1 aria-label="header">(.*?)<\/h1>/.exec(post);
      snippets.header = RegExp.$1;
      /<p aria-label="text">(.*?)<\/p>/.exec(post);
      snippets.text = RegExp.$1;
      return snippets;
   }
   
   /**
    * Public: Recursive blog entry search. 
    * @param {string} dir The root directory for a recursive file search
    * @returns {array} The files list
    */
   getFiles (dir) {
      let files = []; // dir should be: cfg.ROOT{DIRSEP}views{DIRSEP}blog
      const blogFiles = this.loadJson('BlogFiles.json');
      const list = fs.readdirSync(dir);
      list.forEach(file => {
         file = dir + path.sep + file;
         const stat = fs.statSync(file);
         if (stat && stat.isDirectory()) {
            // Recurse to subdir
            files = files.concat(this.getFiles(file));
         } else if (! this.hasController(file)) {
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
               const article_url = `/blog/${sect}/${url}`;
               files.push({
                  file: post,
                  btime: this.getDate('birthtime', file),
                  mtime: this.getDate('mtime', file),
                  article_url: article_url,
                  section_href: `/blog/${sect}/`,
                  section_txt: sect.charAt(0).toUpperCase() + sect.slice(1),
                  img_src: blogFiles[article_url]['img_src'],
                  img_alt: blogFiles[article_url]['img_alt'],
                  img_source: blogFiles[article_url]['img_source']
               });
               if (cfg.DEBUG && cfg.BLOGINDEX) console.log(files);
            }
         }
      });
      return files;
   }
}
 // end class CommonLib}

module.exports = { CommonLib }

