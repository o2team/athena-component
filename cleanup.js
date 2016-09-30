'use strict';

/**
 * 用于清除组件缓存
 */

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const AV = require('leancloud-storage');
const conf = require('./ac-config.js');
const util = require('./util');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});

let wBuild = path.join(conf.warehouse, '_build');
let wTemp = path.join(conf.warehouse, '_temp');

try {
	fse.emptyDirSync(wBuild);
	fse.emptyDirSync(wTemp);
	console.log('Cleanup Success.');
} catch(err) {
	console.error('Cleanup Failed.');
}

fs.readdir(conf.warehouse, function(err, files) {
	files.forEach(function(f) {
		let stat = fs.statSync(path.join(conf.warehouse, f));
		if(!stat.isDirectory()) {
			let widget;
			new Promise(function(resolve, reject) {
				new AV.Query('Widget').notEqualTo('state', 0).get(f).then(function (w) {
					widget = w;
				  resolve();
				}, function(err) {
				  reject('state=0');
				});
			}).then(function(w) {
				return util.unzipWidget(f);
			}).then(function() {
				return util.buildWidget(f, widget);
			}).then(function() {
				console.log('Compiled Succ: ' + f);
			}).catch(function(err) {
				console.log('Compiled Failed: ' + f + err);
			});
		}
	})
});