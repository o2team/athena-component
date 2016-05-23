'use strict';

const 
  os = require('os'),
  fs = require('fs'),
  path = require('path'),

	Koa = require('koa'),
  app = new Koa(),
  router = require('koa-router')(),
  serve = require('koa-static-server'),
  koaBody = require('koa-body'),

  conf = require('./ac-config.js'),
  db = require('./db.js'),
  api = require('./api');

// Middleware
app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve({rootDir:conf.app}))
  .use(function *(next) {
    if(!this.path.match(/^\/warehouse\//)) {
      yield* next;
    } else {
      let stat = function(file) {
        return function(done) {
          fs.stat(file, done);
        }
      }
      let p = path.join(__dirname, this.path);
      let fstat = yield stat(p);
      if(fstat.isFile()) {
        this.type = path.extname(p);
        this.body = fs.createReadStream(p);
      }
    }
  });

// 组件详情
router.get('/api/detail/:uuid', api.detail);
// 组件列表
router.get('/api/list', api.list);
// POST: appId, moduleId, platform [, description, author]
// 上传组件数据
router.post('/api/push', koaBody( {multipart: true, formidable:{uploadDir: os.tmpdir()}} ), api.push);
// 通过id拉取组件打包文件
router.get('/api/pull/:uuid/:rename?', api.pull);

router.get('/api/test', function *(){
  setTimeout(() => {
      this.body = 'wwww';
  }, 1000);
});

app.listen(conf.port);