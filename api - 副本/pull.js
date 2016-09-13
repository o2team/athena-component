'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');
const util = require('../util.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx, next) => {
  let id = ctx.params.id;
  let rename = ctx.params.rename;

  let widget;
  
  if(!id) { ctx.status = 404; return; }

  // 更新计数器
  let updateCounter = function() {
    util.dumpLog(`下载组件 - ${ctx.ip} -> ${id}`);
    
    let w = AV.Object.createWithoutData('Widget', id);
    w.increment('pullTimes', 1);
    // w.fetchWhenSave(true);
    w.save().then(function() {
      // console.log('succ')
    }, function(err) {
      console.log(err)
    });
  }
  
  await new Promise(function(resolve, reject) {
    new AV.Query('Widget').get(id).then(function (w) {
      widget = w;
      resolve();
    }, function(err) {
      reject(err);
    });
  }).then(function() {
    // 解压组件
    return util.unzipWidget( widget.id );
  }).then(function() {
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
        src: ['**', '!_build_*.css']
      }])
      .finalize();

    let name = rename || widget.get('name');
    ctx.set('Content-disposition','attachment;filename=' + name + '.zip');
    ctx.body = archive;
    updateCounter();

  }).catch(function(err) {
    console.error(err);
    ctx.status = 404;
  });
}