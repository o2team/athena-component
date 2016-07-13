'use strict';

const
	fs = require('fs'),
	path = require('path'),
	UUID = require('node-uuid'),
	fstream = require('fstream'),
	unzip = require('unzip'),
	conf = require('../ac-config.js'),
	db = require('../db.js');

// POST: appId, moduleId, platform [, description, author]
module.exports = async (ctx, next) => {
	let body = ctx.req.body;
	let appId = body.appId;
	let moduleId = body.moduleId;
	let platform = body.platform;
	let description = body.description;
	let author = body.author;
	let widget = ctx.req.file;

	if(appId && moduleId && platform && widget) {
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
				let c = new db.Widget({
				  	uuid: uuid,
				  	name: wname,
				  	description: description || wc.description || '',
				  	appId: appId,
				  	moduleId: moduleId,
				  	author: author || wc.author || '',
				  	platform: (platform==='h5' || platform==='pc') ? platform : 'h5' // h5 | pc, default h5
				});
				c.save(function(err) {
				  	resolve();
				});
			});

			// RETURN
			ctx.status = 200;
			ctx.body = JSON.stringify({
				no: 0,
				data: {
					id: uuid
				}
			});
		} catch(err) {
			ctx.status = 500;
		}
	} else {
		ctx.status = 404;
	}
}