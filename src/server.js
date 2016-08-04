'use strict';

const 
  os = require('os'),
  fs = require('fs'),
  path = require('path'),

	Koa = require('koa'),
  app = new Koa(),
  router = require('koa-router')(),
  serve = require('koa-static-server'),

  multer = require('koa-multer'),
  upload = multer({ dest: os.tmpdir() }),

  conf = require('./ac-config.js'),
  // db = require('./db.js'),
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

//--------------------API--------------------
// 上传组件数据  POST: appId, moduleId, platform [, description, author]
router.post('/api/push', upload.single('widget'), api.push);
// 通过id拉取组件打包文件
router.get('/api/pull/:id/:rename?', api.pull);
// 组件详情 ?uuid=xx
router.get('/api/detail', api.detail);

router.post('/api/test',  upload.single('widget'), async (ctx, next) => {
  console.log(ctx.req, this)
  let fields = ctx.req.body.fields;
  let widget = ctx.req.body.files.widget;
  console.log(fields, widget)
});

app.listen(conf.port);