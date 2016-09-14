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
  api = require('./api'),
  util = require('./util');

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
// 下载编译好的组件
router.get('/api/down/:id', api.down);
// 组件详情 ?id=xx
router.get('/api/detail', api.detail);
// 组件详情，不包含代码 ?id=xx
router.get('/api/detail-info', api.detailInfo);
// 业务列表
router.get('/api/business/list', api.business.list);
// 分类列表
router.get('/api/classify/list', api.classify.list);

router.get('/api/test', async (ctx, next) => {
  var phantom = require('phantom');

  phantom = await phantom.create(['--ignore-ssl-errors=true', '--local-to-remote-url-access=true']);
  let page = await phantom.createPage();
  await page.property('viewportSize', {width: 375, height: 667});
  await page.property('content', '2rdfjghhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  // await page.open('http://acp.aotu.io/warehouse/_build/57cee31e67f3560057b65226/index.html');
  await page.render('hhehee.png');
  phantom.exit();
});

app.listen(conf.port);