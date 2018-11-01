# KoaPageCache

koa 页面缓存

包含路径缓存和静态文件缓存两个中间件

## 安装

```bash
npm i koa-page-cache
```

# 路径缓存

* 把页面内容缓存到内存，或者缓存到落地文件
* 给页面返回etag或者max-age,使浏览器也缓存页面
* 当页面程序报错，用缓存内容替换报错页面
* 自定义页面报错事件
* 配置页面缓存Key策略
* //TODO:自定义页面缓存Key
* //TODO:gzip压缩和br压缩


## 使用方法

```js
const Koa = require('koa');
const pagecache = require('koa-page-cache')
const app = new Koa();

const mypagecache = pagecache.path_middleware({
  cachetime: 60,
  etag: true
})
sdf
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

const mypagecache = pagecache.path_middleware({
  cachetime: 60,
  etag: true
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
* planlocal 如果页面报错,则用缓存内容替代抛出错误,默认false,不起用,设置成true启用,如果没有启用落地文件缓存,则抛出错误
* onPlanLocal 如果启动了planlocal则执行此函数，参数传入ctx和key
* onerror 当页面报错时调用的函数,接收ctx,error当参数,默认不处理报错，抛出
* urlkey url当作key的规则，如下:

```js
urlkey:{
  protocol: false, //加入protocol部分
  host: false, //加入host部分
  pathname: true, //加入pathname部分
  search: true //加入search部分
}
```

## 实例属性

* middleware koa中间件

## 实例方法 #TODO

* getKey(url) 传入一个url,返回缓存key
* async getMemCache(key) 获取内存缓存
* async getFileCache(key) 获取落地文件缓存
* async clearMemCache(key) 清除内存缓存
* async clearFileCache(key) 删除落地文件缓存

## 额外说明

* 落地文件缓存没有过期时间，只会存储最后一次的内容，文件名不变


# 静态文件缓存

* 设置一个本地文件夹，映射成路径 //TODO:映射多个文件夹
* 设置etag或者max-age,使浏览器也缓存静态文件
* 支持直接把less文件映射成编译后的css
* 支持把静态文件缓存进内存
* //TODO:gzip压缩和br压缩


## 使用方法

```js
const Koa = require('koa');
const pagecache = require('koa-page-cache')
const app = new Koa();

const mypagecache = pagecache.static_middleware({
  cachetime: 60,
  folder: './test/public/',
  maxage: 60,
  etag: true,
  less: true
})
sdf
app.use(mypagecache.middleware)

app.use(function(ctx) {
  ctx.body = 'Hello World';
});

app.listen(3000);

```


## 参数说明

* cachetime 文件缓存进内存的时间，默认0，不进内存，如果静态文件很大的话，不建议开启
* maxage 返回头设置maxage,默认0,不起用maxage,单位秒，大于零则启用
* etag 页面返回头设置etag，默认false,设置成true则启用
* folder 静态文件的文件夹，必填
* less 把对应的less静态文件映射成编译后的css文件，默认false
* route 静态文件path的路由，默认根文件夹


## 实例属性

* middleware koa中间件
