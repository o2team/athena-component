/**
 * 扳手：迁移数据专用
 * @date 2017-06-22
 *
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const zlib = require('zlib')
const request = require('request')
const unzip = require('unzip')
const fstream = require('fstream')
const archiver = require('archiver')
const tmpdir = os.tmpdir()
const downloadUrl = 'http://acp.aotu.io/warehouse/'
const logFile = path.join(process.cwd(), 'wrench.log')

const Parse = require('parse/node')
Parse.initialize('cj44zwy3w00000f659ubkvzhq', 'cj44zwy3x00020f65e7h1ebfa')
Parse.serverURL = 'http://quark.jd.com/j44zwy3w0000/'
const Widget = Parse.Object.extend('Widget')
const Business = Parse.Object.extend('Business')
const Classify = Parse.Object.extend('Classify')

const AV = require('leancloud-storage')
AV.init({
  appId: 'ULAaHI9Bor3WJHCfORaRJ4BW-gzGzoHsz',
  appKey: 'pRYLYgk6yk3aK2G9tNOWhd46'
})

// 对应表 B
const mirrorOfBusiness = {
  // 微信手Q
  '57b6bc2c79bc44005b906ea4': 'YAk0YTejPI',
  // 2017618
  '5902f4b2a22b9d0065cefd97': '16peVjIUZX',
  // 类目馆区
  '593fd50b128fe1006a026c6b': 'aLjwyU2SzT'
}
const mirrorOfClassify = {
  // 标题
  '57b6ae4a165abd0054b123a6': 'hc0amEGQMD',
  // 标签
  '57b6ae548ac2470062d10216': 'bpjfuPwpkT',
  // 选项卡
  '57b6ae5d5bbb50005b69920a': 'hYThFzRnqW',
  // 坑位
  '57b6ae655bbb50005b699252': 'H9CDQnVgQt',
  // 商品列表
  '57b6ae6c1532bc005b8c6fd4': '9ORX9R5Gyt',
  // 挂件
  '57b6ae721532bc005b8c702d': '4MFodlRgX5',
  // 优惠券
  '57b6ae795bbb50005b699321': 'AVOsYpOAwa',
  // 时间轴
  '57b6ae80a34131005f84c9b4': 'HBjXbD0sEc',
  // 其他
  '57ec8766a22b9d005ba8b258': 'VFsBCF0v3s'
}

function saveFile (id) {
  return new Promise((resolve, reject) => {
    const tar = archiver('tar', { gzip: true })
    const fname = `${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`
    const unzipPath = path.join(tmpdir, fname)
    const tgzFile = path.join(tmpdir, `${fname}.tgz`)
    fs.mkdirSync(unzipPath)
    const unzipStream = fstream.Writer({ path: unzipPath })
    const tgzWriteStream = fs.createWriteStream(tgzFile)

    request(`${downloadUrl}${id}`)
      .pipe(unzip.Parse())
      .pipe(unzipStream)
    unzipStream.on('close', () => {
      // console.log('LOG:: unzip success')
      tar.bulk([{
        expand: true,
        cwd: unzipPath,
        src: ['**']
      }])
      tar.pipe(tgzWriteStream)
      tar.finalize()
    })
    tgzWriteStream.on('finish', () => {
      // console.log('LOG:: tgz success')
      fs.readFile(tgzFile, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        // console.log('LOG:: read tgz')
        const parse = new Parse.File(`${fname}.tgz`, [...data])
        parse.save().then(() => {
          // console.log('LOG:: file save success')
          resolve(parse)
        }, (error) => {
          reject(error)
        })
      })
    })
  })
}

function saveToQuark (avdata) {
  return new Promise((resolve, reject) => {
    const id = avdata.id
    const name = avdata.get('name')
    const author = avdata.get('author')
    const business = avdata.get('business').id
    const classify = avdata.get('classify').id
    const platform = avdata.get('platform')
    const pullTimes = avdata.get('pullTimes')

    const w = new Widget()
    w.set('oid', id)
    w.set('stamp', new Date())
    w.set('name', name)
    w.set('author', author)
    const bPointer = Business.createWithoutData(mirrorOfBusiness[business])
    const cPointer = Classify.createWithoutData(mirrorOfClassify[classify])
    w.set('business', bPointer)
    w.set('classify', cPointer)
    w.set('platform', platform === 'h5' ? 0 : 1)
    w.set('pullTimes', pullTimes)
    w.set('state', 0)

    function save () {
      saveFile(id).then((parse) => {
        w.set('package', parse)
        w.save().then(() => {
          console.log('LOG:: save success')
          resolve()
        }).catch((error) => {
          console.error('WARN:: save error - ' + id)
          fs.appendFileSync(logFile, `error ${id}\n`)
        })
      }).catch((error) => {
        // 循环直至保存成功
        console.log('LOG:: _retry_')
        fs.appendFileSync(logFile, `retry ${id}\n`)
        save()
      })
    }
    save()
  })
}

// 有时会tcp中断
const normalSkip = 162

function recursion (page = 0) {
  let query = new AV.Query('Widget')
  query.notEqualTo('state', 0)
  query.limit(20)
  query.skip(page * 20 + normalSkip)
  query.find().then(async (results) => {
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].id)
      await saveToQuark(results[i])
    }
    if (results.length > 0) {
      recursion(++page)
    } else {
      // 结束
      console.log('数据转移完毕！')
    }
  })
}

recursion()
