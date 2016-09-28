'use strict';

/**
 * 用于清除组件缓存
 */

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const conf = require('./ac-config.js');

let wBuild = path.join(conf.warehouse, '_build');
let wTemp = path.join(conf.warehouse, '_temp');

try {
	fse.emptyDirSync(wBuild);
	fse.emptyDirSync(wTemp);
	console.log('Cleanup Success.');
} catch(err) {
	console.error('Cleanup Failed.');
}