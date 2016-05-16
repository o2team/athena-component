'use strict';

const 
	Path = require('path');

module.exports = {
	// 运行端口
	port: process.env.PORT || 80,

	// 数据库
	mongodb: {
		// 'mongodb://username:password@host:port/database?options'
		uri: 'mongodb://localhost/acp',
		// 详查http://mongoosejs.com/docs/connections.html
		options: {}
	},

	// 前端目录
	app: Path.join(__dirname, 'app'),

	// 组件存放目录
	warehouse: Path.join(__dirname, 'warehouse'),

	// 数据文件存放目录
	dbdir: Path.join(__dirname, 'database')
}