/**
 * make less
 */
const fs = require('fs-extra')
const less = require('less')
const path = require('path')

module.exports = {
  async make(filepath) {
    let css = await fs.readFile(filepath, 'utf-8')
    let back = await less.render(css, {
      paths: [path.dirname(filepath)],
      syncImport: false
    })
    return back.css
  }
}