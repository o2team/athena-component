'use strict';

const
	fs = require('fs'),
	path = require('path'),
	UUID = require('node-uuid'),
	fstream = require('fstream'),
	unzip = require('unzip'),
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = function *() {
	yield new Promise(resolve => {
		let that = this;
		let uuid = UUID.v1();
		let fields = this.request.body.fields;
		let widget = this.request.body.files.widget;
		
		if(!widget) { this.status = 404; return; }
		
		let wname = path.basename(widget.name, '.zip');
		let distDir = path.join(conf.warehouse, uuid);
		
		fs.mkdir(distDir, function (err) {
			let readStream = fs.createReadStream( widget.path );
			let writeStream = fstream.Writer(distDir);
			
			writeStream.on('close', function() {
			  	// let wc = require(path.join(distDir, wname+'.json'));
			  	fs.readFile( path.join(distDir, wname+'.json'), function(err, data) {
			  	  	if(err) {
			  	  	  	console.log(err);
			  	  	  	that.body = '没找到配置文件';
			  	  	  	resolve();
			  	  	} else {
			  	  	  	let wc = JSON.parse(data.toString());
			  	  	  	let author = fields.author || wc.author || '';
			  	  	  	let description = fields.description || wc.description || '';
			  	  	  	// 默认是h5，固定h5/pc两个
			  	  	  	let platform = (fields.platform==='h5' || fields.platform==='pc') ? fields.platform : 'h5';
			  	  	  	// 存数据库
			  	  	  	let c = new db.Widget({
			  	  	  	  	uuid: uuid,
			  	  	  	  	name: wname,
			  	  	  	  	description: description,
			  	  	  	  	appId: fields.appId,
			  	  	  	  	moduleId: fields.moduleId,
			  	  	  	  	author: author,
			  	  	  	  	platform: platform
			  	  	  	});
			  	  	  	c.save(function(err) {
			  	  	  	  	if(err) {
			  	  	  	  	  	console.log(err);
			  	  	  	  	  	that.status = 500;
			  	  	  	  	} else {
			  	  	  	  	  	that.status = 200;
			  	  	  	  	}
			  	  	  	  	resolve();  //Resolve
			  	  	  	});
			  	  	}
			  	});
			});
		
			readStream
			  .pipe(unzip.Parse())
			  .pipe(writeStream);
		});
	});
}