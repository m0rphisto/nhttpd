
const path = require('node:path');
const fs = require('node:fs');
const {sprintf} = require('sprintf-js');

const getFiles = (dir) => {
   let files = [];
   const list = fs.readdirSync(dir);
   list.forEach(file => {
      file = dir + path.sep + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
         // Recurse to subdir
         files = files.concat(getFiles(file));
      } else {
         // (?<!negative-look-behind)
         if (file.match(/(?<!index)\.html$/)) {
            files.push({
               file: file,
               mtime:stat.mtime.getTime()
            });
         }
      }
   });
   return files;
};


const newest = getFiles(__dirname);
//newest.sort((a,b) => {return a.mtime - b.mtime}); // ascending
newest.sort((a,b) => {return b.mtime - a.mtime}); // descending
for (let i = 0; i < 3; i++) {
   const date = new Date(newest[i].mtime);
   const timestamp = sprintf(
      '%d-%02d-%02d %02d:%02d:%02d',
         date.getFullYear(), date.getMonth() + 1, date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()
      );
   console.log(`\nnewest[${i}].file:  ${newest[i].file}`);
   console.log(`newest[${i}].mtime: ${timestamp}`);
}
