/**
 * $Id: nhttpd.js v0.7 2025-04-22 22:34:09 +0200 .m0rph $
 * 
 * This is my first Node.js edu project. A little HTTP server with
 * template parser and file access control.
 */

// Since we work: CommonJS, we have to set this! EVERYWHERE !!!
'use strict';


// At first we have to check if we are root or we cannot open privilleged ports !!!
if (process.getuid() !== 0) {
   console.log('\x1b[31m[!] ERROR: nhttpd must be started as root. Exiting!!!');
   process.exit();
}

const
   // Load built-in modules.
   http = require('node:http'),
   path = require('node:path'),
   fs   = require('node:fs');

require('module-alias/register');

// Load nhttpd modules
const
   cfg        = require('@lib/Config'),
   {log}      = require('@lib/Logger'),
   {header}   = require('@lib/Headers'),
   {chkInput} = require('@lib/Sanitizer'),
   Load       = require('@lib/Loader'),
   Controller = require('@lib/Controller'),
   Template   = require('@lib/Template'),
   Geoip      = require('@lib/GeoipLookup');

// Load HTTP Status Codes and forbidden files list...
const status_codes = Load.json('HTTPStatusCodes.json'); 
const favicon      = fs.readFileSync(path.join(__dirname, 'img','favicon.32x32.png'));


// Then we handle uncaught exceptions and log them. 
process.on('uncaughtException', (err) => {
   log(1, cfg.ipaddr, `Uncaught Exception: ${err.stack || err.message}`); 
});
process.on('unhandledRejection', (err) => {
   log(1, cfg.ipaddr, `Unhandled Rejection at: ${promise} - reason ${reason}`); 
});



// Build server (request, response)
const httpd = http.createServer((req, res) => {

   // And due to the scopes we have to define it here again,
   // because this so called callback-hell has its OWN scope !!!
   'use strict';

   // Get ip address for logging purposes
   cfg.ipaddr = req.socket.remoteAddress;

   chkInput(req, res).then(valid => {
 
      // A way to avoid 'await', because the http.CreateServer callback
      // is not allowed to be async, respectively return a promise!
      // Via .then(...) we can catch that.

      if (! valid) return; // Sanitizer returned !!0, so we do nothing here !!!
   
      if (! status_codes) {
         // ... no HTTP Satus Codes list, then we have to quit.
         log(1, 'ERROR', 'Could not load HTTP Status Codes.');
         res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
         res.end('500 - Internal Server Error');
         return;
      }        
   
      const getRobotsTxt = () => {
         let file = '';
         const botsjson = Load.json('RobotsTxt.json');
         for (const block of Object.keys(botsjson)) {
            // Todo: work with .map(([key, value]) => { .... }
            for (const key of Object.keys(botsjson[block])) {
               file += `${key}: ${botsjson[block][key]}\n`;
            }
            file += '\n';
         }
         return file;
      }
      
      const check_index = (url) => {
         // Redirect directory index.
         const regex = /\/$/;
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
         if (req.url === '/favicon.ico') {
            // Workaround for the annoying favicon.ico loading.
            res.writeHead(200, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'png'));
            res.end(favicon);
            log(0, cfg.ipaddr, `${status_codes['200']} ${req.url}`);
         } else if (req.url === '/robots.txt') {
            // OK, lets feed those crawlers.
            res.writeHead(200, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
            res.end(getRobotsTxt());
            log(0, cfg.ipaddr, `${status_codes['200']} ${req.url}`);
         } else {
            // OK, finally deliver the file.
            const url = path.join(__dirname, redirect(check_index(req.url)));
            fs.readFile(url, (err, data) => {
               if (err) {
                  // Plain file errors
                  res.writeHead(404, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
                  res.end(`${status_codes['404']}`);
                  log(1, cfg.ipaddr, `${status_codes['404']} ${req.url}`);
               } else {
                  // We need to send the correct MIME type and have to load a controller module.
                  const mime = Template.mime(url);
                  if (cfg.DEBUG && cfg.REQUEST) console.log(req.url);
                  if (cfg.DEBUG && cfg.HEADERS) console.log(req.headers);
                  if (mime == 'html') {
                     // At first we have to check if the controller exists !!!
                     if (! Controller.check(check_index(req.url))) {
                        // If !!0 was returned, but no data, the controller doesn't exist
                        // or any other error occured. Maybe an attack attempt?
                        log(1, cfg.ipaddr, `${status_codes['404']} ${req.url}`);
                        req.url = '/error/404'
                     }
                     data = Template.parse(data,
                        Controller.get(check_index(req.url)).data()
                     );
                     data = Template.parse(data, {
                        // Menu, breadcrumbs and footer section:
                        // These template variables have also to be replaced in EVERY view.
                        'MENU': Template.menu(Load.view('meta/menu.html')),
                        'BREADCRUMBS': Template.breadcrumbs(req.url, Load.view('meta/box.breadcrumbs.html')),
                        'BOX_CONTACT_DATA': Load.view('meta/box.contact-data.html'),
                        'IPADDRESS': cfg.ipaddr,
                        'USERAGENT': req.headers['user-agent'],
                        'GEOIPDATA': geoip(['city', 'countryLong'])
                     });
                     data = Template.finalize(data);
                  }
                  res.writeHead(200, header(`${cfg.HOSTNAME}:${cfg.PORT}`, mime));
                  res.end(data);
                  if (! req.url.includes('error'))
                     log(0, cfg.ipaddr, `${status_codes['200']} ${req.url}`);
               }
            });
         }
      } // end if req.method === 'GET'

   // end: chkInput(req, res).then(valid => {
   }).catch(err => {
      res.writeHead(500, header(`${cfg.HOSTNAME}:${cfg.PORT}`, 'txt'));
      res.end(`${status_codes['500']}`);
      log(1, cfg.ipaddr, `${status_codes['500']}: -=[${err}]=-`);
   });
})
.on('clientError', (err, sock) => {
   sock.end('400 - Bad Request');
   // Get ip address for logging purposes and handle client errors.
   log(1, sock.remoteAddress, `${status_codes['400']} --{${err}}--`);
})
.listen(cfg.PORT, cfg.HOST, () => {
   // In order to open the privilleged ports 80 or 443 we need root permissions, but
   // due to security reasons we later have to switch to an unprivilleged user.
   try {
      process.setgid(cfg.GID);
      process.setuid(cfg.UID);
      console.log(`Privileges dropped to UID: ${process.getuid()}, GID: ${process.getgid()}`);
   } catch (err) {
      console.error('Error decreasing user permissions. Exiting !!!');
      process.exit(1);
   }
   console.log(cfg.FID);
   console.log(`Server running at ${cfg.PROTO}${cfg.HOSTNAME}:${cfg.PORT}/`);
});
// EOF
