'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
const util = require('../util');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
	appId: APP_ID,
	appKey: APP_KEY
});

const wBuild = path.join(conf.warehouse, '_build');
const wTemp = path.join(conf.warehouse, '_temp');

module.exports = async (ctx, next) => {
	let widget;
	let id = ctx.request.query.id;
	
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