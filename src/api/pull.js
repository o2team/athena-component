'use strict';

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
const db = require('../db.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx, next) => {
  let folder;
  let id = ctx.params.id;
  let rename = ctx.params.rename;
  let zip = new AdmZip();

  if(!id) { ctx.status = 404; return; }

  await new Promise(function(resolve, reject) {
    let query = new AV.Query('Widget');
    query.get(id).then(function (data) {
      folder = data.get('folder');
      resolve();
    }, function (err) {
      console.error(err);
    });
  });
  
  zip.addLocalFolder( path.join(conf.warehouse, folder) );

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
        let c = fs.readFileSync( path.join(conf.warehouse, folder, name) );
        // 这步有一定危险性
        c = c.toString().replace(`"${basename}"`, `"${rename}"`);
        zipEntry.setData(new Buffer(c))
      }
    }
  });

  ctx.set('Content-disposition','attachment;filename='+id+'.zip');

  ctx.body = zip.toBuffer();

  // 更新计数器
  let widget = AV.Object.createWithoutData('Widget', id);
  widget.increment('pullTimes', 1);
  // widget.fetchWhenSave(true);
  widget.save();

}