const zlib = require('zlib')
const UglifyJS = require("uglify-js")

module.exports = {
  gzip: async function (content) {
    return new Promise((resolve, reject) => {
      resolve(zlib.gzipSync(content))
    })
  },
  uglifyjs: async function (content) {
    if (Buffer.isBuffer(content)) {
      content = content.toString()
    }

    var options = {
      ie8: true,
      compress: false,
      mangle: true
    }

    return new Promise((resolve, reject) => {
      resolve(UglifyJS.minify(content, options).code)
    })
  }
}