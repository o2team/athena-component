var fs = require('fs'),
	path = require('path')
	conf = require('./src/config/config.js');

var fdList = [
	conf.warehouse,
	conf.logsDir
];

function createFolder(fd, errcount) {
	if(errcount && errcount>3) {
		return;
	}
	fs.stat(fd, function(err) {
		if(err) {
			fs.mkdir(fd, function(err) {
				if(err) {
					createFolder(fd, errcount+1);
				} else {
					console.log('创建文件夹%s', fd);
				}
			});
		} else {
			console.log('文件夹%s已存在', fd);
		}
	});
}

fdList.forEach(function(item) {
	createFolder(item, 0);
});
