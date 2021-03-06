/**
 * 生成key
 */

//const encryption = require('../encryption')
const hash = require('object-hash');

module.exports = function(url, options){
  let keyobj = {}

  if(options.protocol)
    keyobj.protocol = url.protocol

  if(options.host)
    keyobj.host = url.host

  if(options.pathname)
    keyobj.pathname = url.pathname

  if(options.search){
    let searchobj = {}
    for(var pair of url.searchParams.entries()) {
      searchobj[pair[0]] = pair[1]
    }
    keyobj.search = searchobj
  }
 
  return hash.sha1(keyobj)
}