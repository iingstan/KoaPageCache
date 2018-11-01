/**
 * 落地文件缓存
 */

const fs = require('fs-extra')
const path = require('path')

module.exports = {
  getPath(key, folder){
    return {
      dirpath: path.join(folder, key.substring(0,2)),
      filepath: path.join(folder, key.substring(0,2), key)
    }
  },
  /**
   * put file cache
   */
  async put(key, value, folder){
    if (key == '' || key == null || key == undefined) {
      throw new Error('key can not be empty')
    }
    let keypath = this.getPath(key, folder)
    fs.ensureDirSync(keypath.dirpath)
    if(Buffer.isBuffer(value)){
      return fs.writeFile(keypath.filepath, value)
    }

    return fs.writeFile(keypath.filepath, JSON.stringify(value), 'utf-8')
  },
  /**
   * get file cache
   *
   * @param {*} key
   */
  async get(key, folder){
    let keypath = this.getPath(key, folder)
    if (fs.existsSync(keypath.filepath)) {
      let result = await fs.readFile(keypath.filepath, 'utf-8')
      try {
        return JSON.parse(result)
      } catch (error) {
        return result
      }
    }
    else{
      throw new Error('do not have this file cache，Key: ' + key)
      return null
    }
  },
  /**
   * 删除文件缓存
   *
   * @param {*} key
   * @returns
   */
  async del(key, folder){
    let keypath = this.getPath(key, folder)
    return fs.unlink(keypath.filepath)
  }
}