'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');

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
  
  try {
    let archive = archiver('zip');

    archive.on('error', function(err) {
      throw err;
    });
    archive.on('entry', function(file) {
      // console.log(file)
    });

    // 重命名工程
    if(rename) {
      archive.onBeforeAppend = function(filePath, data) {
        let stats = fs.statSync(filePath);
        if(stats.isFile()) {
          let pathRelative = path.relative( path.join(conf.warehouse, folder), filePath);
          let name = data.name;
          let dirname = path.dirname(pathRelative);
          let extname = path.extname(name);
          let basename = path.basename(name, extname);

          // 即不包括images下的图片文件
          if(dirname==='.') {
            data.name = rename + extname;
          }

        }
      } 
    }

    archive
      .bulk([{
        expand: true,
        cwd: path.join(conf.warehouse, folder),
        src: ['**']
      }])
      .finalize();

    ctx.set('Content-disposition','attachment;filename='+id+'.zip');
    ctx.body = archive;

    // 更新计数器
    let widget = AV.Object.createWithoutData('Widget', id);
    widget.increment('pullTimes', 1);
    // widget.fetchWhenSave(true);
    widget.save();
  } catch(err) {
    ctx.status = 500;
  }
}