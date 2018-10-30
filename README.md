# KoaPageCache

koa 页面缓存 middleware

* 把页面内容缓存到内存，或者缓存到落地文件
* 给页面返回etag或者max-age,使浏览器也缓存页面
* 当页面程序报错，用缓存内容替换报错页面
* 自定义页面报错事件
* 设置页面缓存Key和页面地址关系
* 自定义页面缓存Key


## 使用方法

```js
const Koa = require('koa');
const pagecache = require('koa-page-cache')
const app = new Koa();

const mypagecache = pagecache({
  cachetime: 60
})

app.use(mypagecache.middleware)

app.use(function(ctx) {
  ctx.body = 'Hello World';
});

app.listen(3000);

```

如果使用koa-router
```js
const Koa = require('koa');
const pagecache = require('koa-page-cache')
const Router = require('koa-router');

const app = new Koa();

const mypagecache = pagecache({
  cachetime: 60
})

let router = new Router();

router.get('/', mypagecache.middleware, (ctx, next) => {
  // ctx.router available
});

app
  .use(router.routes())
  .use(router.allowedMethods());
```

## 参数说明

* cachetime 页面缓存时间,默认0,不起用缓存,本中间件没用,单位秒,大于零则启用
* maxage 返回头设置maxage,默认0,不起用maxage,单位秒，大于零则启用
* filecachefolder 落地缓存文件夹地址，默认空，不起用落地缓存，不为空则启用
* etag 页面返回头设置etag，默认false,设置成true则启用
* errorlocal 如果页面报错,则用缓存内容替代报错页面,默认false,不起用,设置成true启用
* onerror 当页面报错时调用的函数,接收ctx,error当参数,默认不处理报错，抛出
* urlkey url当作key的规则，如下:

```js
urlkey:{
  protocol: false, //加入protocol部分
  host: false, //加入host部分
  pathname: true, //加入pathname部分
  search: false, //加入search部分
  hash: false //加入hash部分
}
```

### 实例属性

* middleware koa中间件

## 实例方法

* getKey(url) 传入一个url,返回缓存key
* async getMemCache(key) 获取内存缓存
* async getFileCache(key) 获取落地文件缓存
* async clearMemCache(key) 清除内存缓存
* async clearFileCache(key) 删除落地文件缓存

## 额外说明

* 落地文件缓存没有过期时间，只会存储最后一次的内容，文件名不变