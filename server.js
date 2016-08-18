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
// 组件详情 ?id=xx
router.get('/api/detail', api.detail);
// 组件详情，不包含代码 ?id=xx
router.get('/api/detail-info', api.detailInfo);
// 业务列表
router.get('/api/business/list', api.business.list);

router.get('/api/test', async (ctx, next) => {
  const AV = require('leancloud-storage');
  const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

  var query = new AV.Query('Business');
      query.get('57ac2c19c4c9710054613d5e2').then(function (data) {
        console.log(data)
      }, function (error) {
        console.log(error)
      });
});

app.listen(conf.port);