/**
 * $Id: Logger.js 2025-04-24 23:38:03 +0200 .m0rph $
 *
 * nhttpd logging facility
 */

'use strict';

// Needed for the logfiles
const { Console } = require('node:console');
const { createWriteStream, appendFileSync } = require('node:fs');
const { sprintf } = require('sprintf-js');
const path = require('node:path');
const cfg = require('@lib/Config');

const files = {
   // The http.server module uses lower case !!!
   'user-agent': 'user-agents',
   'accep-language': 'accepted-languages',
   'cache-control': 'cache-controls',
   'referer': 'referers',
   'dnt': 'do-not-track'
}
const logger = new Console({
    // Prepare log message printing
    stdout: createWriteStream(path.join(cfg.LOG, 'access.log'), { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' }),
    stderr: createWriteStream(path.join(cfg.LOG, 'error.log'),  { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' })
});

const d = {
    now: () => { return new Date() },
    date: () => {
        let date = d.now();
        return sprintf('%d-%02d-%02d', date.getFullYear(), date.getMonth() + 1, date.getDate());
  
    },
    time: () => {
        let date = d.now();
        return sprintf('%02d:%02d:%02d', date.getHours(), date.getMinutes(), date.getSeconds());
    }
}

exports.collect = (type, ip, data) => {
   if (type in files) {
      appendFileSync(
         path.join(cfg.COLLECTIONS, `${files[type]}.txt`),
         `[${d.date()} ${d.time()}] ${ip} ${data}\n`,
         { encoding: 'utf8', mode: 0o0640 }
      );
   }
}

exports.log = (stat, ip, msg) => {
    const str = `[${d.date()} ${d.time()}] ${ip} - ${msg}`;
    const stream = (stat == 0) ? 'log' : 'error';
    logger[stream](str);
}
