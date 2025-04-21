/**
 * $Id: Logger.js 2024-01-01 05:40:28 +0100 .m0rph $
 *
 * nhttpd logging facility
 */

'use strict';

// Needed for the logfiles
const { Console } = require('node:console');
const { createWriteStream } = require('node:fs');
const { sprintf } = require('sprintf-js');
const path = require('node:path');

const logger = new Console({
    // Prepare log message printing
    stdout: createWriteStream(path.join(__dirname, '../log', 'access.log'), { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' }),
    stderr: createWriteStream(path.join(__dirname, '../log', 'error.log'),  { 'flags': 'a', 'encoding': 'utf-8', 'mode': '0644' })
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

exports.log = (stat, ip, msg) => {
    const str = `[${d.date()} ${d.time()}] ${ip} - ${msg}`;
    const stream = (stat == 0) ? 'log' : 'error';
    logger[stream](str);
};
