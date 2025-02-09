/**
 * ...  597 Jan  8 05:44 ./index.html
 * ... 3804 Jan  7 23:06 ./network/the-7-layer-osi-model.html
 * ... 3999 Jan  8 05:49 ./network/the-igmp-protocol.html
 * ... 3402 Jan  7 23:12 ./security/igmp-snooping.html
 */

const path = require('node:path');
const fs   = require('node:fs');

const { sprintf } = require('sprintf-js');

const dir = __dirname;

const getFiles = (dir, done) => {
   let files = [];
   fs.readdir(dir, (err, list) => {
      if (err) return done(err);
      let pending = list.length;
      if (!pending) return done(null, files);
      list.forEach(file => {
         file = path.resolve(dir, file);
         fs.stat(file, (err, stat) => {
            if (stat && stat.isDirectory()) {
               getFiles(file, (err, res) => {
                  files = files.concat(res);
                  if (! --pending) done(null, files);
               });
            } else {
               if (! file.match(/index.html$/)) {
                  files.push({
                     file: file,
                     mtime:stat.mtime.getTime()
                  });
               }
               if (! --pending) done(null, files);
            }
         });
      });
   });
};

var newest = ['0'];
getFiles(dir, (err, files) => {
   if (err) throw err;
   files.sort(function(a, b) {return a.mtime - b.mtime});
   for (let i = 0; i < 3; i++) {
      newest.push(files[i].file);
   }
console.log('INSIDE: '+new Date().getTime());
console.log(newest);
});

console.log('OUTSIDE: '+new Date().getTime());
console.log(newest);
