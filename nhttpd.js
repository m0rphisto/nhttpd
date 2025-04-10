/**
 * $Id: nhttpd.js v0.3 2025-04-10 10:10:49 +0200 .m0rph $
 * 
 * This is my first Node.js edu project. A little HTTP server with
 * template parser and file access control.
 */

const
   // Load built-in modules.
   http = require('node:http'),
   path = require('node:path'),
   fs   = require('node:fs');

const
   // Load nhttpd modules
   cfg  = require('./config'),
   {log} = require('./lib/Logger'),
   {header} = require('./lib/Headers'),
   Load = require('./lib/Loader'),
   Controller = require('./lib/Controller'),
   Template = require('./lib/Template'),
   Geoip = require('./lib/GeoipLookup');

// Load HTTP Status Codes and forbidden files list...
const status_codes = Load.json('HTTPStatusCodes.json'); 
const forbidden_files = Load.json('ForbiddenFiles.json');
const favicon = fs.readFileSync(path.join(__dirname,'img','favicon.32x32.png'));


// Build server (request, response)
const httpd = http.createServer((req, res) => {

   // Get ip address for logging purposes
   //const ipaddr = req.socket.remoteAddress;
   cfg.ipaddr = req.socket.remoteAddress;


   if (! status_codes) {
      // ... no HTTP Satus Codes list, then we have to quit.
      log(1, 'ERROR', 'Could not load HTTP Status Codes.');
      res
         .writeHead(500, header(cfg.HOSTNAME, 'txt'))
         .end('500 - Internal Server Error');
      return;
   }        
   if (! forbidden_files) {
      // ... no forbidden files list, then we have to quit.
      log(1, 'ERROR', 'Could not load forbidden files list.');
      res
         .writeHead(500, header(cfg.HOSTNAME, 'txt'))
         .end('500 - Internal Server Error');
      return;
   }        
   
   const forbidden = (url) => {
      // Check for forbidden files.
      for (const key of Object.keys(forbidden_files)) {
         if (forbidden_files.hasOwnProperty(key))
            if (url.match(forbidden_files[key])) return !!1;
      }
      return !!0;
   }

   const check_index = (url) => {
      // Redirect directory index.
      regex = /\/$/
      if (regex.test(url)) {
         let urlpath = [];
         urlpath = url.split('/').filter((str) => str !== '');
         urlpath.push('index.html');
         return urlpath.join('/');
      } else
         return url;
   }
   const redirect = (url) => {
      // Redirect SEO URLs
      let urlpath = url.split('/').filter((str) => str !== ''); 
      const regex = /^[0-9a-zA-Z_-]+$/;
      if (regex.test(urlpath[urlpath.length - 1])) {
         if (url.includes('/blog/'))
            // In case of a request for blog articles, we need
            // to use the section related index view.
            urlpath[urlpath.length - 1] = 'index.html';
         else
            // Otherwise we simply append a file extension.
            urlpath[urlpath.length - 1] = urlpath[urlpath.length - 1] + '.html';
         urlpath.unshift('views');
      } else if (urlpath[urlpath.length - 1].endsWith('.html')) {
         urlpath.unshift('views');
      } else
         return url;
      return urlpath.join(path.sep);
   }
   const geoip = (keys) => {
      let data = []; // Get geoip location data
      const ipdata = Geoip.data((cfg.DEV) ? '79.199.124.55' : cfg.ipaddr);
      for (const key of keys) {
         data.push(ipdata[key]);
      }
      return data.join(', ');
   }

   if (req.method === 'GET') {
      if (forbidden(req.url)) {
         res // Check for forbidden files and directory indexes.
            .writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'))
            .end(`${status_codes['404']}`);
         log(1, cfg.ipaddr, `${status_codes['404']} FORBIDDEN ${req.url}`);
      } else if (req.url === '/favicon.ico') {
         // Workaround for the annoying favicon.ico loading.
         res.writeHead(200, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'png')).end(favicon);
         log(0, cfg.ipaddr, `${status_codes['200']} ${req.url}`);
      } else {
         // OK, finally deliver the file.
         const url = path.join(__dirname, redirect(check_index(req.url)));
         fs.readFile(url, (err, data) => {
            if (err) {
               // Plain file errors
               res
                  .writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'))
                  .end(`${status_codes['404']}`);
               log(1, cfg.ipaddr, `${status_codes['404']} ${req.url}`);
            } else {
               // We need to send the correct MIME type and have to load a controller module.
               const mime = Template.mime(url);
               //console.log(req.url)
               if (cfg.DEBUG && cfg.HEADERS) console.log(req.headers)
               if (mime == 'html') {
                  // At first we have to check if the controller exists !!!
                  if (! Controller.check(check_index(req.url))) {
                     // If !!0 was returned, but no data, the controller doesn't exist
                     // or any other error occured. Maybe an attack attempt?
                     log(1, cfg.ipaddr, `${status_codes['404']} ${req.url}`);
                     req.url = 'error/404'
                  }
                  data = Template.parse(data,
                     Controller.get(check_index(req.url)).data()
                  );
                  data = Template.parse(data, {
                     // Footer section: These template variables
                     // have to be replaced in EVERY view.
                     'IPADDRESS': cfg.ipaddr,
                     'USERAGENT': req.headers['user-agent'],
                     'GEOIPDATA': geoip(['city', 'countryLong'])
                  });
                  data = Template.finalize(data);
               }
               res
                  .writeHead(200, header(`${cfg.HOSTNAME}:${cfg.PORT}`, mime))
                  .end(data);
               if (! req.url.includes('error'))
                  log(0, cfg.ipaddr, `${status_codes['200']} ${req.url}`);
            }
         });
      }
   } else {
      // Request method is not GET
      res
         .writeHead(405, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'))
         .end(`${status_codes['405']}`);
      log(1, cfg.ipaddr, `${status_codes['405']} ${req.url}.`);
   } // end if req.method === 'GET'
})
.on('clientError', (err, sock) => {
   sock.end(`{$status_codes['400']}`);
   // Handle client errors and log the reason.
   log(1, cfg.ipaddr, `${status_codes['400']} ${err}`);
   if (DEBUG && CLIENT_ERRORS) throw err;
})
.listen(cfg.PORT, cfg.HOST, () => {
   console.log(cfg.FID);
   console.log(`Server running at ${cfg.PROTO}${cfg.HOSTNAME}:${cfg.PORT}/`);
});
// EOF
