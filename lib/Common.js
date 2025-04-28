/**
 * $Id: Common.js 2025-04-27 05:40:29 +0200 .m0rph $
 *
 * nhttpd common lib
 */

'use strict';

// Needed for the logfiles
//const { Console } = require('node:console');
const { sprintf } = require('sprintf-js');
const
   fs = require('node:fs'),
   path = require('node:path'),
   cfg = require('@lib/Config');


exports.d = {
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


/**
 * Public: Gets the given timestamp for a blog article's view.
 a
 * @param   {string} mode  Timestamp mode (btime/mtime)
 * @param   {string} view  The blog view
 * @returns {string} date  The formatted timestamp
 */
exports.getDate = (mode, view) => {
   const date = fs.statSync(view)[mode];
   return sprintf(
      '%d-%02d-%02d %02d:%02d:%02d',
         date.getFullYear(), date.getMonth() + 1, date.getDate(),
         date.getHours(), date.getMinutes(), date.getSeconds()
   );
}


