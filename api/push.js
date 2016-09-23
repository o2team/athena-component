'use strict';

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
const business = require('./business');
const util = require('../util.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});

module.exports = async (ctx, next) => {
	let body = ctx.req.body;
	let appId = body.appId;
	let moduleId = body.moduleId;
	let platform = body.platform;
	let author = body.author;
	let desc = body.description;
	let business = body.business;
	let classify = body.classify;
	
	let widget = ctx.req.file;

	if(!appId || !moduleId || !platform || !author || !widget) {
		ctx.status = 404;
		ctx.body = '必要参数缺失';
		return;
	}
	
	let wname = path.basename(widget.originalname, '.zip');
		
	await Promise.resolve().then(function() {
		// 检验白名单
		// Leancloud的单元操作并非真正的Promise，体现为异常的传递不一致
		// 在then中抛异常，后台直接跪了，而不是给它自己的catch捕获
		var query = new AV.Query('Account');
		query.equalTo('name', author);
		return new Promise(function(resolve, reject) {
			query.find().then(function (results) {
				if(results.length===0) {
					reject({
						type: 'unauth',
						message: '用户不在白名单之列'
					});
				} else {
					resolve();
				}
			});
		});
	
	}).then(function() {
		// 指定的business是否存在
		if(business) {
			return new Promise(function(resolve, reject) {
				var query = new AV.Query('Business');
				query.get(business).then(function (data) {
					resolve();
				}, function (error) {
					reject('指定业务不存在');
				});
			});
		}
	}).then(function() {
		// 指定的classify是否存在
		if(classify) {
			return new Promise(function(resolve, reject) {
				var query = new AV.Query('Classify');
				query.get(classify).then(function (data) {
					resolve();
				}, function (error) {
					reject('指定类别不存在');
				});
			});
		}
	}).then(function() {
		// 存数据库
		var widget = new AV.Object('Widget');

		// https://leancloud.cn/docs/relation_guide-js.html#使用_Pointers_实现一对多关系
		if(business) {
			var bus = AV.Object.createWithoutData('Business', business);
			widget.set('business', bus);
		}
		if(classify) {
			var cls = AV.Object.createWithoutData('Classify', classify);
			widget.set('classify', cls);
		}

		return new Promise(function(resolve, reject) {
			widget.save({
				name: wname,
				desc: desc,
				appId: appId,
			  	moduleId: moduleId,
			  	author: author,
			  	platform: (platform==='h5' || platform==='pc') ? platform : 'h5' // h5 | pc, default h5
			}).then(function(w) {
				resolve(w);
			}).catch(function(err) {
				reject(err);
			});
		})
			
	}).then(function(w) {
		// 拷贝文件到新文件夹
		return new Promise(function(resolve, reject) {
			let readStream = fs.createReadStream( widget.path );
			let writeStream = fs.createWriteStream( path.join(conf.warehouse, w.id) );
			readStream.pipe( writeStream );
			writeStream.on('finish', function() {
				resolve(w);
			});
		});
	}).then(function(w) {
		util.dumpLog(`上传组件 - ${author} ${ctx.ip} -> ${w.id}`);
		// Response
		ctx.status = 200;
		ctx.body = JSON.stringify({
			no: 0,
			data: {
				id: w.id
			}
		});
		// 解压文件
  		util.unzipWidget( w.id )
  		.then(function() {
  			setTimeout(function() {
// 编译组件
  			util.buildWidget( w.id, w).catch(function(err) {
  				console.error(err);
  			});
  			}, 5000);
  			
  		})
  		.catch(function(err) {
    		console.error(err);
  		});
	}).catch(function(err) {
		ctx.status = 403;
		ctx.body = JSON.stringify({
			err: err,
			type: err.type
		});
	});
}