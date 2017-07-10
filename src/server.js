require('babel-register')({
  ignore: /node_modules\/(?!koa-static|koa-send)/
})

const os = require('os')
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const serve = require('koa-static')

const multer = require('koa-multer')
const upload = multer({dest: os.tmpdir()})

const conf = require('./config/config.js')
const api = require('./api')
const util = require('./util')

// Middleware
app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve(conf.app))
function fileServe (that, p) {
  try {
    let fstat = fs.statSync(p)
    if (fstat.isFile()) {
      that.type = path.extname(p)
      that.body = fs.createReadStream(p)
    }
  } catch (err) {
    // console.log(err)
  }
}
app.use(async (ctx, next) => {
  const reqPath = ctx.path
  if (!reqPath.match(/^\/warehouse\//)) {
    await next()
  } else if (reqPath.match(/capture\.png/)) {
    let p = path.join(__dirname, '..', reqPath)
    if (!util.existsSync(p)) {
      ctx.body = fs.createReadStream(path.join('src', '404.png'))
    } else {
      fileServe(ctx, p)
    }
  } else {
    let p = path.join(__dirname, '..', reqPath)
    fileServe(ctx, p)
  }
})

//--------------------API--------------------
router.post('/api/push', upload.single('widget'), api.push)
router.get('/api/pull/:id/:rename?', api.pull)
router.get('/api/down/:id/:rename?', api.down)

router.get('/api/business/list', api.business.list)

router.get('/api/classify/list', api.classify.list)

router.get('/api/widget/query', api.widget.query)
router.get('/api/widget/count', api.widget.count)
router.get('/api/widget/detail/:id', api.widget.detail)
router.get('/api/widget/info/:id', api.widget.info)
// router.get('/api/widget/del/:id', api.widget.del)

router.get('/api/account/list', api.account.list)
// router.get('/api/account/add', api.account.add)
// router.get('/api/account/del/:id', api.account.del)

router.get('/api/test', async (ctx, next) => {
  // api.business.getById
})

app.listen(conf.port)

console.info(`服务器已启动 PORT: ${conf.port}`)
