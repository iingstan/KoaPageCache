const makekey = require('./modules/makekey')
const memcache = require('memory-cache')
//const etag = require('./modules/etag')
const etag = require('etag')
const filecache = require('./modules/filecache')
const stream = require('stream');
const fs = require('fs-extra')
const path = require('path')
const makeless = require('./modules/makeless')
const { URL } = require('url')


class path_middleware {
  constructor(options){
    //options
    var default_options = {
      cachetime: 0,
      maxage: 0,
      etag: false,
      filecachefolder: '',
      planlocal: false,
      urlkey:{
        protocol: false,
        host: false,
        pathname: true,
        search: true
      },
      onerror: function(ctx, error){
        throw error
      },
      onPlanLocal: function(ctx, key){
        
      }
    }
    this.options = Object.assign(default_options, options)

    if(this.options.cachetime <= 0){
      this.middleware =  async function(ctx, next){
          await next()
      }
      return this
    }

    this.middleware = async (ctx, next)=>{
      let key = makekey(ctx.URL, this.options.urlkey)
      let cache_content = memcache.get(key)
      if (cache_content) {
        if(this.options.etag && ctx.request.header['if-none-match'] == cache_content.etag){
          ctx.status = 304
          return
        }

        if(this.options.maxage){
          ctx.set('Cache-Control','max-age=' + this.options.maxage)
        }
        if(this.options.etag){
          ctx.set('Etag', cache_content.etag)
        }
        ctx.set('Last-Modified', cache_content.time)
        ctx.set('Content-Type', cache_content.contenttype)
        ctx.body = cache_content.txt
      }
      else{
        try{
          await next()
          let now = (new Date()).toGMTString()
          let etagval = ''

          if(this.options.maxage){
            ctx.set('Cache-Control','max-age=' + this.options.maxage)
          }

          if (this.options.etag){
            etagval = etag((ctx.body))
            ctx.set('Etag', etagval)
          }
          ctx.set('Last-Modified', now)

          memcache.put(key, {
            txt: ctx.body,
            time: now,
            contenttype: ctx.response.header['content-type'],
            etag: etagval
          }, this.options.cachetime * 1000)

          if(this.options.filecachefolder){ //filecache
            filecache.put(key, ctx.body, this.options.filecachefolder)
          }
        }
        catch(error){
          console.error(error);
          if(this.options.filecachefolder && this.options.planlocal){
            let filecachec = await filecache.get(key, this.options.filecachefolder)

            ctx.body = filecachec

            this.options.onPlanLocal(ctx, key)
          }
          else{
            this.options.onerror(ctx, error)
          }
        }      
      }

    }

  }

  getKey(url) {
    url = new URL(url)
    return makekey(url, this.options.urlkey)
  }
}

/**
 * 静态文件中间件
 */
class static_middleware{
  constructor(options){
    var default_options = {
      cachetime: 0,
      folder: '',
      route: '',
      maxage: 0,
      etag: false,
      less: false
    }
    this.options = Object.assign(default_options, options)

    if(this.options.folder == ''){
      this.middleware = async (ctx, next)=>{
        await next()
      }
      return this
    }

    this.middleware = async (ctx, next)=>{
      let filepath = ctx.request.path
      if(this.options.route){
        if(ctx.request.path.indexOf('/' + this.options.route + '/') == 0){
          filepath = filepath.replace('/' + this.options.route, '')
        }
        else{
          await next()
          return
        }
      }

      filepath = path.join(this.options.folder, filepath)

      let key = 'static|' + filepath
      
      if(this.options.cachetime){
        let cache_content = memcache.get(key)
        if (cache_content) {
          if(this.options.etag && ctx.request.header['if-none-match'] == cache_content.etag){
            ctx.status = 304
            return
          }

          if(this.options.maxage){
            ctx.set('Cache-Control','max-age=' + this.options.maxage)
          }

          if(this.options.etag){
            ctx.set('Etag', cache_content.etag)
          }

          //ctx.set('Last-Modified', cache_content.time)
          ctx.type = cache_content.type
          ctx.body = cache_content.content
          return 
        } 
              
      }


      if( await fs.exists(filepath)){
        
        let stat = await fs.stat(filepath)

        if(stat.isDirectory()){
          await next()
          return
        }

        //max-age
        if(this.options.maxage){
          ctx.set('Cache-Control','max-age=' + this.options.maxage)
        }        
        
        let etagval

        //less
        if(path.extname(filepath) == '.less' && this.options.less){
          //console.info(222, key)
          let css = await makeless.make(filepath)
          //TODO: file backup
          //etag 304
          etagval = etag(css)
          if(this.options.etag && ctx.request.header['if-none-match'] == etagval){
            ctx.status = 304
            return
          }
          
          if(this.options.etag){
            ctx.set('Etag', etagval)
          }          
          ctx.type = 'text/css'
          ctx.body = css
        }
        else{

          //etag 304
          etagval = stat.mtimeMs.toString()
          if(this.options.etag && ctx.request.header['if-none-match'] == etagval){
            ctx.status = 304
            return
          }
          //etag
          if(this.options.etag){
            ctx.set('Etag', etagval)
          }

          ctx.type = path.extname(filepath)
          //console.info(222, key)
          if(this.options.cachetime){
            ctx.body = await fs.readFile(filepath)
          }
          else{
            ctx.body = fs.createReadStream(filepath) 
          }
                   
        }

        if(this.options.cachetime){
          memcache.put(key, {
            content: ctx.body,
            type: ctx.type,
            etag: etagval
          }, this.options.cachetime * 1000)
        }

      }
      else{
        await next()
        return         
      }

       
    }
  }



}



module.exports = {
   path_middleware,
   static_middleware
}
