const Koa = require('koa');
const app = new Koa();
const koapagecache = require('../index')
const fs = require('fs')

//静态文件缓存
const publiccache = new koapagecache.static_middleware({
  cachetime: 60,
  folder: './test/public/',
  maxage: 60,
  etag: true,
  less: true,
  gzip: true,
  uglifyjs: true
})

app.use(publiccache.middleware)

//url缓存
const mypagecache = new koapagecache.path_middleware({
  cachetime: 60,
  //maxage: 60,
  etag: true,
  planlocal: true,
  filecachefolder: './cache/',
  onPlanLocal: function(ctx, key){
    console.info('error')
    console.info(ctx.href)
    console.info(key)
  }
})

app.use(mypagecache.middleware)



app.use(function(ctx) {
  //console.info(111)
  // console.info(ctx.path)
  // if(ctx.path == '/cat.jpg'){
  //   ctx.set('Content-Type','image/jpeg')
  //   //ctx.body = fs.readFileSync('./test/cat.jpg')
  //   ctx.body = fs.createReadStream('./test/pu/cat.jpg')
  // }
  // else if(ctx.path == '/favicon.ico'){
  //   ctx.set('Content-Type','image/x-icon')
  //   ctx.body = fs.readFileSync('./test/favicon.ico')
  // }  
  if(ctx.path == '/'){
    ctx.set('Content-Type','text/html; charset=utf-8')
    ctx.body = '<link href="./main.less" rel="stylesheet"><a href="/">Hello World</a> <img style="vertical-align: middle" src="./cat.jpg"> ' + mypagecache.getKey(ctx.href) + '<div>sdf</div>'//mypagecache.getKey(ctx.href)
    return
  }

  ctx.status = 404

});

app.listen(3000);


console.log('listening on port 3000');