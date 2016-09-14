'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const unzip = require('unzip');
const fstream = require('fstream');
const lodash = require('lodash');
const phantom = require('phantom');
const conf = require('./ac-config.js');

function getDate () {
  let ts = new Date();
  return ts.getFullYear() + '-' + 
    ('0' + (ts.getMonth() + 1)).slice(-2) + '-' + 
    ('0' + (ts.getDate() + 1)).slice(-2) + ' ' +
    ('0' + ts.getHours()).slice(-2) + ':' +
    ('0' + ts.getMinutes()).slice(-2) + ':' +
    ('0' + ts.getSeconds()).slice(-2);
}

// 文件是否存在
exports.existsSync = function (pd) {
	try {
		fs.accessSync(pd);
		return true;
	} catch(err) {
		return false;
	}
}

/**
 * 解压缩组件
 * @param {id} <String>
 */
exports.unzipWidget = function (id) {
	return new Promise(function (resolve, reject) {
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
			readStream.on('error', function (err) {
				reject(err);
			});
			writeStream.on('end', function () {
			  resolve();
			});
		}
		resolve();
		
	});
}

/**
 * 编译组件 = 组合放到iframe的html文件，编译相关数据读写，截图
 * @param {id} <String>
 * @param {widget} <Object> Leancloud 查询对象
 */
exports.buildWidget = function (id, widget) {
	return new Promise(async (resolve, reject) => {
		if(!id) {reject('没有提供组件ID'); return;}

		// 编译路径
		const widgetBuiltPath = path.join(conf.warehouse, '_build', id);
		// 编译图片路径
		const widgetBuiltImgPath = path.join(widgetBuiltPath, 'images');
		// 编译整合信息文件（为减少文件读写次数而生）
		const widgetBuiltIntegratePath = path.join(widgetBuiltPath, 'integrate.json');
		// 编译预览HTML路径
		const widgetBuiltHtmlPath = path.join(widgetBuiltPath, 'index.html');

		// 如果有，直接返回
		if(this.existsSync(widgetBuiltIntegratePath)) {
			resolve(JSON.parse(fs.readFileSync(widgetBuiltIntegratePath).toString()));
			return;
		}

		// 定义 回滚处理
		const rollback = function () {
			fse.remove(widgetBuiltPath, function(err) {
				if(err) {console.error(err);}
			});
		}
		// 定义 写整合文件
		const writeIntegrate = function (integrate) {
			try {
				fs.writeFileSync(widgetBuiltIntegratePath, JSON.stringify(integrate));
				return true;
			} catch(err) {
				console.error(err);
				return false;
			}
		}

		// 创建编译目录
		try {
			fse.emptyDirSync(widgetBuiltPath);
			fse.emptyDirSync(widgetBuiltImgPath);
		} catch(err) {
			reject(err);
			console.error(err);
			rollback(err);
			return;
		}

		// 所有内容整合到一个文件
		let integrate = {};
		let contHtml, contBuiltHtml, contScss, contBuiltCss, contCss, contJs, contJson;
		// 解压路径
		let widgetTempPath = path.join(conf.warehouse, '_temp', id);
		// 解压图片路径
		let widgetTempImgPath = path.join(widgetTempPath, 'images');
		// 解压HTML路径
		let contHtmlPath = path.join(widgetTempPath, widget.get('name') + '.html');
		// 解压SCSS路径
		let contScssPath = path.join(widgetTempPath, widget.get('name') + '.scss');
		// 解压CSS路径 - 优先用编译好的CSS文件
		let contBuiltCssPath = path.join(widgetTempPath,  '_build_' + widget.get('name') + '.css');
		let contCssPath = path.join(widgetTempPath, widget.get('name') + '.css');
		// 解压JS路径
		let contJsPath = path.join(widgetTempPath, widget.get('name') + '.js');
		// 解压JSON路径
		let contJsonPath = path.join(widgetTempPath, widget.get('name') + '.json');

		// 读取组件 HTML, SCSS, CSS, JS
		try {contHtml = fs.readFileSync(contHtmlPath).toString(); integrate.contHtml = contHtml;} catch(err) { /* DO NOTHING */ }
		try {contScss = fs.readFileSync(contScssPath).toString(); integrate.contScss = contScss;} catch(err) { /* DO NOTHING */ }
		try {contBuiltCss = fs.readFileSync(contBuiltCssPath).toString(); integrate.contBuiltCss = contBuiltCss;} catch(err) { /* DO NOTHING */ }
		try {contCss = fs.readFileSync(contCssPath).toString(); integrate.contCss = contCss;} catch(err) { /* DO NOTHING */ }
		try {contJs = fs.readFileSync(contJsPath).toString(); integrate.contJs = contJs;} catch(err) { /* DO NOTHING */ }
		try {contJson = fs.readFileSync(contJsonPath).toString(); integrate.contJson = contJson;} catch(err) { /* DO NOTHING */ }

		// 如果没有HTML就没必要编译
		if(!contHtml) {
			if(!writeIntegrate(integrate)) {
				rollback();
				// 此处虽然写失败，不需要return中断，因为内容仍存在变量中
			}
			resolve(integrate);
			return;
		}

		// HTML编译，变量在配置文件的data字段提供
		contHtml = contHtml.replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '');
		try {
		  integrate.contBuiltHtml = contBuiltHtml = lodash.template(contHtml)(
		    JSON.parse(contJson).data
		  );
		} catch(err) {
		  console.error('模板渲染错误：' + err);
		}

		// 提前返回
		resolve(integrate);

		// 写整合文件
		if(!writeIntegrate(integrate)) {
			rollback();
			return;
		}
		
		// 写预览HTML文件
		let commonstyle = conf.tpl[`css${widget.get('platform')}`] || '';
		let iframe = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>Document</title><style>${commonstyle};${contBuiltCss || contCss || ''}</style></head><body>${contBuiltHtml}<script>${contJs}</script></body></html>`;
		try {
			fs.writeFileSync(widgetBuiltHtmlPath, iframe);
		} catch(err) {
			console.error(err);
			rollback(err);
			return;
		}

		// 复制图片
		let reader = fstream.Reader(widgetTempImgPath);
		let writer = fstream.Writer(widgetBuiltImgPath);
		reader.pipe(writer);
		reader.on('error', function () { rollback(); })
		writer.on('close', function () { });
		
		// 网页截图
		let instance = await phantom.create(['--ignore-ssl-errors=true', '--local-to-remote-url-access=true']);
		let page = await instance.createPage();
		// await page.property('viewportSize', {width: 375, height: 667});
		await page.open('file:///' + path.resolve(`${conf.warehouse}/_build/${id}/index.html`));
		await page.render(`${conf.warehouse}/_build/${id}/capture.png`);
		instance.exit();
	});
}

exports.dumpLog = function (msgText) {
	if(!msgText) { return; }
	let ts = new Date().toISOString().replace(/T.+/, '');
	let logFile = path.join(conf.logsDir, `${ts}.log`);
	let logStr = `${getDate()} - ${msgText}\n`;
	fs.appendFileSync(logFile, logStr);
}