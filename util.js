'use strict';

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const fstream = require('fstream');
const conf = require('./ac-config.js');

/**
 * 解压缩组件
 * @param {id} <String>
 */
exports.unzipWidget = function(id) {
	return new Promise(function(resolve, reject) {
		
		if(!id) { reject('没有提供组件ID'); return; }

		// 组件路径
		let widgetTempPath = path.join(conf.warehouse, '_temp', id);
		try {
		  fs.accessSync( widgetTempPath );
		} catch(err) {
			try {
		  	// 创建文件夹
		  	fs.mkdirSync( widgetTempPath );
		  } catch(err) {
		  	reject(err);
		  	return;
		  }
		  // 解压缩组件
			let readStream = fs.createReadStream( path.join( conf.warehouse, id ) );
			let writeStream = fstream.Writer( widgetTempPath );
			readStream
			  .pipe(unzip.Parse())
			  .pipe(writeStream);
			readStream.on('error', function(err) {
				reject(err);
			});
			writeStream.on('close', function() {
			  resolve();
			});
		}
		resolve();
		
	});
}