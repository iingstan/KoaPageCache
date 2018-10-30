/**
 * hash
 */

const crypto = require('crypto');


module.exports = {
  sha1(str) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(str);
    var res = sha1.digest("hex");
    return res;
  }
}