const Koa = require('koa');
const app = new Koa();
const koapagecache = require('../index')

const mypagecache = new koapagecache({
  cachetime: 5
})

app.use(mypagecache.middleware)

app.use(function(ctx) {
  console.info(111)
  ctx.body = 'Hello World' + mypagecache.getKey(ctx.href)
});

app.listen(3000);


console.log('listening on port 3000');