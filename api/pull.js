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
  let id = ctx.params.id;
  let rename = ctx.params.rename;
  
  if(!id) { ctx.status = 404; return; }

  // 更新计数器
  let updateCounter = function() {
    let w = AV.Object.createWithoutData('Widget', id);
    w.increment('pullTimes', 1);
    // w.fetchWhenSave(true);
    w.save().then(function() {
      console.log('succ')
    }, function(err) {
      console.log(err)
    });
  }

  if(!rename) {
    await new Promise(function(resolve, reject) {
      new AV.Query('Widget').get(id).then(function (widget) {
        resolve(widget);
      }, function(err) {
        reject(err);
      });
    }).then(function(widget) {
      ctx.set('Content-disposition','attachment;filename='+widget.get('name')+'.zip');
      ctx.body = fs.readFileSync( path.join(conf.warehouse, id) );
      updateCounter();
    }).catch(function(err) {
      console.error(err);
      ctx.status = 404;
    });
  } else {
    ctx.set('Content-disposition','attachment;filename='+rename+'.zip');
    ctx.body = fs.readFileSync( path.join(conf.warehouse, id) );
    updateCounter();
  }
      
  /*如果有冲泯灭
  await Promise.resolve().then(function(widget) {
    // 组件路径
    let widgetTempPath = path.join(conf.warehouse, '_temp', id);
    try {
      fs.accessSync( widgetTempPath );
    } catch(err) {
      // 创建
      fs.mkdirSync( widgetTempPath );
      // 解压缩组件
      await new Promise(function(resolve, reject) {
        let readStream = fs.createReadStream( path.join( conf.warehouse, widget.id ) );
        let writeStream = fstream.Writer( widgetTempPath );
        readStream
          .pipe(unzip.Parse())
          .pipe(writeStream);
        writeStream.on('close', function() {
          resolve();
        });
      });
    }

    try {
      let archive = archiver('zip');
      
      archive.on('error', function(err) {
        throw err;
      });
      archive.on('entry', function(file) {
        // console.log(file)
      });

      archive
        .bulk([{
          expand: true,
          cwd: path.join(conf.warehouse, '_temp', id),
          src: ['**']
        }])
        .finalize();

      ctx.set('Content-disposition','attachment;filename='+rename+'.zip');
      ctx.body = archive;
    } catch(err) {
      console.error(err);
      ctx.status = 500;
    }
  }).catch(function(err) {
    console.error(err);
    ctx.status = 403;
    ctx.body = err;
  });*/
}