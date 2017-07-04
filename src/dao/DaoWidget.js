import Parse from './init'

const fs = require('fs')
const request = require('request')
const Widget = Parse.Object.extend('Widget')
const Business = Parse.Object.extend('Business')
const Classify = Parse.Object.extend('Classify')

async function get (id) {
  let widget
  // 兼容舊id
  if (id && id.length && id.length === 24) {
    const query = new Parse.Query(Widget)
    query.equalTo('oid', id)
    return query.first().catch((error) => {
      console.log(error)
    })
  } else {
    widget = await new Parse.Query(Widget).get(id).catch((error) => {
      console.log(error)
    })
  }
  return widget
}

function query ({keyword, business, classify, page = 0, size = 20}) {
  const query = new Parse.Query(Widget)
  const bPointer = business && Business.createWithoutData(business)
  const cPointer = classify && Classify.createWithoutData(classify)
  size = Number.parseInt(size) || 20

  keyword && query.contains('name', keyword)
  business && query.equalTo('business', bPointer)
  classify && query.equalTo('classify', cPointer)
  query.limit(size)
  query.skip(page * size)
  query.equalTo('state', 0)
  query.descending('createdAt')
  return query.find()
}

/**
 * 存储组件
 * @param [id] {String} 组件id，如果有提供就是更新操作
 * @param [appId] {String}
 * @param [moduleId] {String}
 * @param name {String} 组件名
 * @param business {String} 业务id
 * @param classify {String} 分类id
 * @param author {String} 作者名
 * @param [platform] {Number} 平台 0=h5 1=pc
 * @param file {Object} 组件
 */
function save ({id, appId, moduleId, name, business, classify, author, platform = 0, pullTimes = 0, state = 0, file}) {
  const widget = id ? Widget.createWithoutData(id) : new Widget()
  const bPointer = Business.createWithoutData(business)
  const cPointer = Classify.createWithoutData(classify)
  const fname = `${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`

  appId && widget.set('appId', appId)
  moduleId && widget.set('moduleId', moduleId)
  widget.set('stamp', new Date())
  widget.set('business', bPointer)
  widget.set('classify', cPointer)
  widget.set('name', name)
  widget.set('author', author)
  widget.set('platform', platform)
  widget.set('pullTimes', pullTimes)
  widget.set('state', state)

  return new Promise((resolve, reject) => {
    function saveFile (_retry = 0) {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          reject('组件上传失败')
          return
        }
        const parse = new Parse.File(`${fname}.tgz`, [...data])
        parse.save().then(() => {
          widget.set('package', parse)
          widget.save().then((w) => {
            resolve(w)
          }).catch((error) => {
            reject('组件保存失败')
          })
        }).catch((error) => {
          _retry <= 3 ? saveFile(++_retry) : reject('组件上传失败')
        })
      })
    }
    saveFile()
  })
}

// 计数器增
function increment (id) {
  const query = new Parse.Query(Widget)
  query.get(id).then((w) => {
    w.increment('pullTimes')
    w.save()
  }).catch((error) => {
    console.error(error)
  })
}

function pack (id) {
  const query = new Parse.Query(Widget)
  return query.get(id).then((w) => {
    const pack = w.get('package')
    return request(pack.url())
  }).catch((error) => {
    console.error(error)
  })
}

async function checkLatest (id, date) {
  if (!id) {
    return
  }
  date = new Date(parseInt(date))
  if (date === 'Invalid Date') {
    return
  }
  date = date.getTime()
  const w = await get(id)
  if (!w) {
    return
  }
  const wupdate = w.get('stamp').getTime()
  return date === wupdate
}

async function count ({business, classify}) {
  const query = new Parse.Query(Widget)
  const bPointer = business && Business.createWithoutData(business)
  const cPointer = classify && Classify.createWithoutData(classify)
  business && query.equalTo('business', bPointer)
  classify && query.equalTo('classify', cPointer)
  query.equalTo('state', 0)
  const count = await query.count()
  console.log(count)
  return count
}

function del (id) {
  const widget = Widget.createWithoutData(id)
  widget.set('state', 1)
  return widget.save()
}

export default {
  get,
  query,
  save,
  increment,
  pack,
  checkLatest,
  count,
  del
}
