'use strict';

const fs = require('fs');
const path = require('path');
const UUID = require('node-uuid');
const fstream = require('fstream');
const unzip = require('unzip');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
// const db = require('../db.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});

// POST: appId, moduleId, platform [, description, author]
module.exports = async (ctx, next) => {
	let body = ctx.req.body;
	let appId = body.appId;
	let moduleId = body.moduleId;
	let platform = body.platform;
	let desc = body.description;
	let author = body.author;
	let widget = ctx.req.file;

	if(appId && moduleId && platform && widget) {
		let wid;
		let uuid = UUID.v1();
		let wname = path.basename(widget.originalname, '.zip');
		let distDir = path.join(conf.warehouse, uuid);

		try {
			// 创建组件文件夹
			fs.mkdirSync(distDir);

			// 拷贝文件到新文件夹
			await new Promise(function(resolve, reject) {
				let readStream = fs.createReadStream( widget.path );
				let writeStream = fstream.Writer(distDir);
				readStream
					.pipe(unzip.Parse())
					.pipe(writeStream);
				writeStream.on('close', function() {
					resolve();
				});
			});

			// 读取配置文件
			let jsonFile = fs.readFileSync( path.join(distDir, wname+'.json') );

			// 存数据库
			await new Promise(function(resolve, reject) {
				let wc = JSON.parse( jsonFile.toString() );
				var Widget = AV.Object.extend('Widget');
				var widget = new Widget();
				widget.save({
					name: wname,
					desc: desc || wc.desc || '',
					appId: appId,
				  	moduleId: moduleId,
				  	author: author || wc.author || '',
				  	platform: (platform==='h5' || platform==='pc') ? platform : 'h5', // h5 | pc, default h5
				  	// 新增，改为作存储文件的目录名，而不是组件ID
				  	folder: uuid
				}).then(function(w) {
					wid = w.id;
				  	resolve();
				}).catch(function(err) {
					console.error(err);
				});
			});

			// Response
			ctx.status = 200;
			ctx.body = JSON.stringify({
				no: 0,
				data: {
					id: wid
				}
			});
		} catch(err) {
			console.error(err);
			ctx.status = 500;
		}
	} else {
		ctx.status = 404;
	}
}