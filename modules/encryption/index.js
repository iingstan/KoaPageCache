/**
 * hash
 */

const crypto = require('crypto');


module.exports = {
  /**
   * string sha1
   * @param {string} str 
   */
  sha1(str) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(str);
    var res = sha1.digest("hex");
    return res;
  },
  /**
   * stream sha1
   * @param {stream} str 
   */
  async streamSha1(str){
    return new Promise((resolve, reject)=>{
      let hash = crypto.createHash('sha1')
      let result = []
      str.on('end', function() {
        resolve(hash.digest('hex').substring(0, 10), result.join(''))
      });
      str.on('readable', function() {
        var chunk;
        while (null !== (chunk = str.read())) {
          hash.update(chunk);
          result.push(chunk)
        };
      });
    })
  }
}