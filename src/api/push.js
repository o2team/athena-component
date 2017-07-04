import { Widget, Account, Business, Classify } from '../dao'
const fs = require('fs')
const path = require('path')
const util = require('../util')

/**
 * @param platform {Number|Number} 平臺識別
 * @param author {String} 作者
 * @param business {String} 業務id
 * @param classify {String} 分類id
 * @param widget {File} 組件TGZ壓縮包
 */
module.exports = async (ctx, next) => {
	const body = ctx.req.body
  const widget = ctx.req.file

  let appId = body.appId
  let moduleId = body.moduleId
	let platform = body.platform
  if (platform ===  'mobile' || platform ===  'h5') {
    platform = 0
  } else if (platform === 'pc') {
    platform = 1
  } else {
    platform = parseInt(platform) || 0
  }
	let author = body.author
	let business = body.business
	let classify = body.classify
  // wp -i xxx | 覆盖上传
  let widgetId = body.widgetId

  if(!author || !business || !classify || !widget) {
		ctx.status = 404
		ctx.body = '必要参数缺失'
		return
	}

	let wname = path.basename(widget.originalname, '.tgz')

	await Promise.resolve().then(() => {
		// 检验白名单
    return new Promise((resolve, reject) => {
      Account.first(author).then((result) => {
        result ? resolve() : reject({ type: 'unauth', message: '用户不在白名单之列' })
      }).catch((error) => {
        reject({ type: 'unauth', message: '用户不在白名单之列' })
      })
    })
	}).then(() => {
		// 指定的business是否存在
    return new Promise((resolve, reject) => {
      Business.getById(business).then((result) => {
        resolve()
      }).catch((error) => {
        reject('指定业务不存在')
      })
    })
	}).then(() => {
		// 指定的classify是否存在
    return new Promise((resolve, reject) => {
      Classify.getById(classify).then((result) => {
        resolve()
      }).catch((error) => {
        reject('指定类别不存在')
      })
    })
	}).then(() => {
		// 存数据
    return new Promise((resolve, reject) => {
      Widget.save({
        id: widgetId,
        appId,
        moduleId,
        name: wname,
        business,
        classify,
        author,
        platform,
        file: widget
      }).then((w) => {
        resolve(w)
      }).catch((error) => {
        reject(error)
      })
    })
	}).then(function(w) {
		util.dumpLog(`上传组件 - ${author} ${ctx.ip} -> ${w.id}`)
		ctx.status = 200
		ctx.body = JSON.stringify({
			no: 0,
			data: {
				id: w.id
			}
		})
    util.buildWidget(w.id)
	}).catch(function(err) {
    console.log(err)
		ctx.status = 403
		ctx.body = JSON.stringify({
			err: err,
			type: err.type
		})
	})
}
