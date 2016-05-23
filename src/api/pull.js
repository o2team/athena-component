'use strict';

const
	fs = require('fs'),
	path = require('path'),
	AdmZip = require('adm-zip'),
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = function *() {
  let uuid = this.params.uuid;
  let rename = this.params.rename;
  let zip = new AdmZip();

  zip.addLocalFolder(path.join(conf.warehouse, uuid));

  // 压缩包内文件的处理
  let zipEntries = zip.getEntries();
  zipEntries.forEach(function(zipEntry) {
    if(rename && !zipEntry.isDirectory) {
      let name = zipEntry.entryName;
      let extname = path.extname(name);
      let dirname = path.dirname(name);
      let basename = path.basename(name, extname);
      // adm-zip竟然判定images不是文件夹   
      if(dirname==='.' && name!=='images') {
        zipEntry.entryName = rename+extname;
      }
      if(extname==='.json') {
        let c = fs.readFileSync( path.join(conf.warehouse, uuid, name) )
        c = c.toString().replace(basename, rename);
        zipEntry.setData(new Buffer(c))
      }
    }
  });

  this.set('Content-disposition','attachment;filename='+uuid+'.zip');
  this.body = zip.toBuffer();
  db.Widget.update({uuid:uuid}, {$inc:{pullTimes:1}}, function(err, results) {
    if(err) throw err;
  });
}