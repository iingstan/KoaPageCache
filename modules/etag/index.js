/**
 * make etag
 */
const etag = require('etag')
const encryption = require('../encryption')

module.exports = {
  async make(input){
    if(typeof input == 'string' || Buffer.isBuffer(input)){
      return etag(input)
    }
    if(input.pipe){
      return encryption.streamSha1(input)
    }
  },
  async streamMake(input){
    return encryption.streamSha1(input)
  }
}