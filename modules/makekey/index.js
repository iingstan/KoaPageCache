/**
 * 生成key
 */

const encryption = require('../encryption')

module.exports = function(url, options){
  //TODO: 处理options
  return encryption.sha1(url)
}