/**
 * $Id: nhttpd.js v0.1 2023-12-16 17:21:34 +0100 .m0rph $
 * 
 * This is my first Node.js edu project. A little HTTP server with
 * template parser and file access control.
 */
const 
   // Defaults ...
   fid = '$Id: nhttpd.js v0.1 2023-12-16 17:21:34 +0100 .m0rph $',
   hostname = 'nhttpd.js',
   //hostname = 'nhttpd.m0rphisto.net',
   port = 8081;

// Some debugging flags
const
   DEBUG    = !!0,
   READFILE = !!0,
   HEADERS  = !!1;

const
   // built-in modules.
   http = require('node:http'),
   path = require('node:path'),
   fs   = require('node:fs');

const
   // nhttpd modules
   //Access = require('./lib/Access'),
   {log} = require('./lib/Logger'),
   {header} = require('./lib/Headers'),
   Menu = require('./lib/Menu'),
   Template = require('./lib/Template');


// Build server (request, response)
const httpd = http.createServer((req, res) => {

   // Get ip address for logging purposes
   const ipaddr = req.socket.remoteAddress;

   // Load HTTP Status Codes ...
   fs.readFile('./json/HTTPStatusCodes.json', 'utf-8', (status_err, data) => {

      // Load forbidden files list ...
      fs.readFile('./json/ForbiddenFiles.json', 'utf-8', (forbidden_err, conf) => {

         if (forbidden_err) {
            // ... no forbidden files list, then we have to quit.
            log(1, 'ERROR', forbidden_err);
            res
               .writeHead(500, header(hostname, 'txt'))
               .end('500 - Internal Server Error');
         } else {

            const files = JSON.parse(conf);
   
            /**
             * !!! CALLBACK HELL !!! INDEED !!! 
             * !!! ToDo: modularize, async coding.
             * @param {string} url 
             * @returns boolean
             */
   
            /*
            const Forbidden = (url) => {
               const vars = Object.keys(files);
               for (let i = 0; i < vars.length; i++) {
                  const key = vars[i], val = files[key];
                  if (url.match(val)) return !!1;
               }
               return !!0;
            }
            */
            const Forbidden = (url) => {
               for (const key of Object.keys(files)) {
                  if (files.hasOwnProperty(key))
                     if (url.match(files[key])) return !!1;
               }
               return !!0;
            }
            const check_index = (url) => {
               // Check for the directory index.
               regex = /\/$/;
               //url =  url.toString();
               if (regex.test(url)) {
                  let path = [];
                  path = url.split('/');
                  path.push('index.html');
                  return path.join('/');
               } else
                  return url;
            }

            if (status_err) {
               // ... no status codes files list, quit.
               log(1, 'ERROR', status_err);
               res
                  .writeHead(500, header(`${hostname}:${port}`, 'txt'))
                  .end('500 - Internal Server Error');
            } else {
               const stcds = JSON.parse(data);
               if (req.method === 'GET') {
                  if (Forbidden(req.url)) {
                     res // Check for forbidden files and directory indexes.
                        .writeHead(404, header(`${hostname}:${port}`, 'txt'))
                        .end(`${stcds['404']}`);
                     log(1, ipaddr, `${stcds['404']} FORBIDDEN ${req.url}`);
                     return;
                  } else if (req.url === '/favicon.ico') {
                     // Workaround for the annoying favicon.ico loading.
                     res.statusCode = 200;
                     res.setHeader('Content-Type', 'image/png');
                     fs
                      .createReadStream(path.join(__dirname, 'img', 'favicon.png'))
                      .pipe(res);
                     res.end();
                     log(0, ipaddr, `${stcds['200']} ${req.url}`);
                     return;
                  } else {
                     // ToDo: split into DOCUMENTS/IMAGES/SCRIPTS/STYLES ....
                     // OK, finally deliver the file.
                     const url = path.join(__dirname, check_index(req.url));
                     fs.readFile(url, (err, data) => {
                        if (err) {
                           res
                              .writeHead(404, header(`${hostname}:${port}`, 'txt'))
                              .end(`${stcds['404']}`);
                           log(1, ipaddr, `${stcds['404']} ${req.url}`);
                        } else {
                           let mime = ''; // We need to send the correct MIME type
                           if      (url.match('.html$')) mime = 'html';
                           else if (url.match('.css$'))  mime = 'css';
                           else if (url.match('.js$'))   mime = 'js';
                           else if (url.match('.json$')) mime = 'json';
                           else if (url.match('.jpg$'))  mime = 'jpg';
                           else if (url.match('.png$'))  mime = 'png';
                           else if (url.match('.gif$'))  mime = 'gif';
                           else                         mime = 'txt';
                           if (DEBUG && HEADERS) console.log(req.headers)
                           if (mime == 'html') {
                              data = Template.parse(data, {
                                 'NAVICSS': Menu.css(),
                                 'NAVIHTML': Menu.html(),
                                 'FID': fid,
                                 'URL': req.url,
                                 'USERAGENT': req.headers['user-agent'],
                                 'IPADDRESS': ipaddr
                              });
                              data = Template.finalize(data);
                           }
                           res
                              .writeHead(200, header(`${hostname}:${port}`, mime))
                              .end(data);
                           log(0, ipaddr, `${stcds['200']} ${req.url}`);
                        }
                     });
                     return;
                  }
               } else {
                  // Request method is not GET
                  res
                     .writeHead(405, header(`${hostname}:${port}`, 'txt'))
                     .end(`${stcds['405']}`);
                  log(1, ipaddr, `${stcds['405']}} ${req.url}.`);
                  return;
               } // end if req.method === 'GET'
            } // end if forbidden_err
         } // end if status_err
      }); // end load forbidden files list
   }); // end load status codes
})
.listen(port, hostname, () => {
   console.log(fid);
   console.log(`Server running at http://${hostname}:${port}/`);
});
