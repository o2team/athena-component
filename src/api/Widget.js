import { Widget } from '../dao'
const util = require('../util')

/**
 * 组件列表
 * @param [keyword] {String} 关键词
 * @param [business] {String} 业务id
 * @param [classify] {String} 分类id
 * @param [page] {Number} 页码，默认0，zero-base
 * @param [size] {Number} 每页个数。默认20
 */
async function query (ctx) {
  const query = ctx.request.query
  const keyword = query.keyword
  const business = query.business
  const classify = query.classify
  const page = query.page
  const size = query.size
  await Widget.query({keyword, business, classify, page, size}).then((results) => {
    ctx.body = results
  }).catch((error) => {
    console.log(keyword, business, classify, page, size)
    console.log('WIDGET-QUERY', error)
  })
}

/**
 * 组件个数统计
 * @param [business] {String} 业务id
 * @param [classify] {String} 分类id
 */
async function count (ctx) {
  const query = ctx.request.query
  const business = query.business
  const classify = query.classify
  ctx.body = await Widget.count({business, classify})
}

async function del (ctx) {
  const id = ctx.params.id
  await Widget.del(id).then(() => {
    ctx.status = 200
  }).catch((error) => {
    console.log('WIDGET-DEL', error)
    ctx.status = 403
  })
}

async function detail (ctx) {
  const id = ctx.params.id

  let widget = await Widget.get(id)
  if (!widget) {
    ctx.status = 404
    return
  }

  const integrate = await util.buildWidget(id)

  ctx.body = {
    contHtml: integrate.contHtml,
    contBuiltHtml: integrate.contBuiltHtml,
    contScss: integrate.contScss,
    contBuiltCss: integrate.contBuiltCss,
    // 如果SCSS存在就忽略CSS（这时的CSS可能是组件上传前编译的）
    contCss: !integrate.contScss ? integrate.contCss : '',
    contJs: integrate.contJs,
    contJson: integrate.contJson,
    widget: widget
  }
}

async function info (ctx) {
  let id = ctx.params.id

  let widget = await Widget.get(id)
  if (!widget) {
    ctx.status = 404
    return
  }

  ctx.body = widget
}

module.exports = {
  query,
  count,
  del,
  detail,
  info
}
