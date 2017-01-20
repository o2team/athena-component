const os = require('os')
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const serve = require('koa-static-server')
const convert = require('koa-convert')

const multer = require('koa-multer')
const upload = multer({dest: os.tmpdir()})

const conf = require('./config/config.js')
const api = require('./api')
const util = require('./util')

// Middleware
app.use(router.routes())
app.use(router.allowedMethods())
app.use(convert(serve({rootDir:conf.app})))
app.use(convert(function *(next) {
  if(!this.path.match(/^\/warehouse\//)) {
    yield* next
  } else {
    let stat = function(file) {
      return function(done) {
        fs.stat(file, done)
      }
    }
    let p = path.join(__dirname, this.path)
    try {
      let fstat = yield stat(p)
      if(fstat.isFile()) {
        this.type = path.extname(p)
        this.body = fs.createReadStream(p)
      }
    } catch(err) {}
  }
}))

//--------------------API--------------------
// 上传组件数据  POST: appId, moduleId, platform [, description, author]
router.post('/api/push', upload.single('widget'), api.push)
// 通过id拉取组件打包文件
router.get('/api/pull/:id/:rename?', api.pull)
// 下载编译好的组件
router.get('/api/down/:id/:rename?', api.down)
// 组件详情 ?id=xx
router.get('/api/detail', api.detail)
// 组件详情，不包含代码 ?id=xx
router.get('/api/detail-info', api.detailInfo)
// 业务列表
router.get('/api/business/list', api.business.list)
// 分类列表
router.get('/api/classify/list', api.classify.list)

router.get('/api/test', async (ctx, next) => {
  let phantom = require('phantom')

  phantom = await phantom.create(['--ignore-ssl-errors=true', '--local-to-remote-url-access=true'])
  let page = await phantom.createPage()
  await page.property('viewportSize', {width: 375, height: 667})
  await page.property('content', '2rdfjghhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
  await page.render('hhehee.png')
  phantom.exit()
})

app.listen(conf.port)

console.info('服务器已启动 PORT: ' + conf.port)
