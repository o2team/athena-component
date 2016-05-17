'use strict';

var fs = require('fs'),
		path = require('path');

// 创建路径
var mkpath = function(path, callback) {
	fs.access(path, function(err) {
		if(err) {
			fs.mkdir(dist, function(err) {
				callback(err);
			});
		} else {
			callback();
		}
	});
}

module.exports = {
	/**
	 * @description 复制文件夹
	 * @param src {string} 源文件夹
	 * @param dist {string} 目标路径
	 * @param callback {function} 回调
	 * @param isIncluded {boolean} 是否包含文件夹本身
	 */
	copyFolder: function(src, dist, callback, isIncluded) {
		mkpath(dist, function(err) {
			_copy(err, src, dist);
		});

		function _copy(err, src, dist) {
		  if(err){
		    callback(err);
		  } else {
		    fs.readdir(src, function(err, ps) {
		      if(err){
		        callback(err);
		      } else {
		        ps.forEach(function(p) {
		          var _src = path.join(src, p);
		          var _dist = path.join(dist, p);
		          fs.stat(_src, function(err, stat) {
		            if(err){
		              callback(err);
		            } else {
		              if(stat.isFile()) {
		              	var rs = fs.createReadStream(_src);
		              	var ws = fs.createWriteStream(_dist);
		              	rs.pipe(ws);
		                fs.writeFileSync(_dist, fs.readFileSync(_src));
		              } else if(stat.isDirectory()) {
		                // 当是目录是，递归复制
		                copyDir(_src, _dist, callback)
		              }
		            }
		          })
		        })
		      }
		    })
		  }
		}
	},
}