/**
 * $Id: Headers.js 2023-12-16 06:50:12 +0100 .m0rph $
 *
 * HTTP Headers module. We need different headers,
 * respectively MIME types.
 * 

/**
 * Private: Text based document headers.
 * 
 * @param {string} host The FQDN sender hostname
 * @param {string} type The MIME type
 * @returns {string}    The HTTP headers
 */
const text = (host, type) => {
   return {
      'Host': host,
      'Content-Type': `text/${type}; charset=utf-8`,
      'Content-Language': 'de-DE',
      'Cache-Control': 'no cache',
      'Connection': 'close'
   }
}
/**
 * Private: Text based json file headers.
 * 
 * @param {string} host The FQDN sender hostname
 * @returns {string} The HTTP headers
 */
const json = (host) => {
   return {
      'Host': host,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no cache',
      'Connection': 'close'
   }
}
/**
 * Private: Binary image files.
 * 
 * @param {string} host The FQDN sender hostname
 * @param {string} type The MIME, respectively image type.
 * @returns {string}    The HTTP headers
 */
const image = (host, type) => {
   return {
      'Host': host,
      'Content-Type': `image/${type}`,
      //'Cache-Control': 'max-age=604800', // 604800 seconds is one week
      'Cache-Control': 'no cache',
      'Connection': 'close'
   }
}


/**
 * Public: Returns the HTTP header fields for the requested document.
 * 
 * @param   {string} host  The hostname 
 * @param   {string} type  The document, respectively MIME type
 * @returns {string}       The HTTP headers
 */
exports.header = (host, type) => {
   switch (type) {
      // text based documents
      case 'js':   return text(host, 'javascript');
      case 'txt':  return text(host, 'plain');
      case 'html': return text(host, 'html');
      case 'css':  return text(host, 'css');
      // images
      case 'jpg':  return image(host, 'jpeg');
      case 'png':  return image(host, 'png');
      case 'gif':  return image(host, 'gif');
   }
}
