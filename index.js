const makekey = require('./modules/makekey')
const memcache = require('memory-cache')

class koapagecache {
  constructor(options){
    //options
    var default_options = {
      cachetime: 0,
      urlkey:{
        protocol: false,
        host: false,
        pathname: true,
        search: false,
        hash: false
      },
      onerror: function(ctx, error){
        throw error
      }
    }
    this.options = Object.assign(default_options, options)

    let _this = this

    if(this.options.cachetime <= 0){
      this.middleware =  async function(ctx, next){
          await next()
      }
      return this
    }

    this.middleware = async function(ctx, next){
      let key = makekey(ctx.request.href, _this.options.urlkey)

      let cache_content = memcache.get(key)
      if (cache_content) {
        ctx.body = cache_content
      }
      else{
        try{
          await next()
          memcache.put(key, ctx.body, _this.options.cachetime * 1000)
        }
        catch(error){
          _this.options.onerror(ctx, error)
        }      
      }

    }    
  }

  getKey(url) {
    return makekey(url, this.options.urlkey)
  }
}



module.exports = koapagecache
