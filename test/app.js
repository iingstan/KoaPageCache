const Koa = require('koa');
const app = new Koa();
const koapagecache = require('../index')
const fs = require('fs')

const mypagecache = new koapagecache({
  cachetime: 60,
  maxage: 60,
  etag: true,
  planlocal: true,
  filecachefolder: './cache/'
})

app.use(mypagecache.middleware)

app.use(function(ctx) {
  console.info(111)
  if(ctx.path == '/cat.jpg'){
    ctx.set('Content-Type','image/jpeg')
    ctx.body = fs.readFileSync('./test/cat.jpg')
  }
  // else if(ctx.path == '/favicon.ico'){
  //   ctx.set('Content-Type','image/x-icon')
  //   ctx.body = fs.readFileSync('./test/favicon.ico')
  // }  
  else{
    ctx.set('Content-Type','text/html; charset=utf-8')
    ctx.body = '<a href="/">Hello World</a> <img style="vertical-align: middle" src="./cat.jpg"> ' + mypagecache.getKey(ctx.href)
  }

  

});

app.listen(3000);


console.log('listening on port 3000');