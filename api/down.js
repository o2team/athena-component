'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AV = require('leancloud-storage');
const conf = require('../config/config.js');
const util = require('../util.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx, next) => {
  let id = ctx.params.id;
  let rename = ctx.params.rename ? ctx.params.rename.trim() : '';

  let widget;

  if(!id) { ctx.status = 404; return; }

  let widgetTmpPath = path.join(conf.warehouse, '_temp', id)
  let widgetTmpImagesPath = path.join(widgetTmpPath, 'images')

  // 更新计数器
  let updateCounter = function() {
    util.dumpLog(`下载组件[一键] - ${ctx.ip} -> ${id}`);

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
    return util.unzipWidget( widget.id );
  }).then(function() {
    return util.buildWidget( widget.id, widget);
  }).then(function (integrate) {
    let archive = archiver('zip');

    archive.on('error', function(err) {
      throw err;
    });
    archive.on('entry', function(file) {
      // console.log(file)
    });

    let realName = widget.get('name');
    let wname = rename || realName;
    let regExp

    // 重命名
    if(rename) {
      regExp = new RegExp(realName, 'g');
      integrate.contBuiltHtml && (integrate.contBuiltHtml = integrate.contBuiltHtml.replace(regExp, rename));
      integrate.contBuiltCss && (integrate.contBuiltCss = integrate.contBuiltCss.replace(regExp, rename));
      integrate.contCss && (integrate.contCss = integrate.contCss.replace(regExp, rename));
      integrate.contJs && (integrate.contJs = integrate.contJs.replace(regExp, rename));
    }

    if(integrate.contBuiltHtml) {
      archive.append(new Buffer(integrate.contBuiltHtml), {name: wname + '.html'});
    }
    if(integrate.contBuiltCss) {
      archive.append(new Buffer(integrate.contBuiltCss), {name: wname + '.css'});
    } else if(integrate.contCss) {
      archive.append(new Buffer(integrate.contCss), {name: wname + '.css'});
    }
    if(integrate.contJs) {
      archive.append(new Buffer(integrate.contJs), {name: wname + '.js'});
    }

    if (rename) {
      try {
        let files = fs.readdirSync(widgetTmpImagesPath)
        files.forEach(function (filename) {
          let oldPath = path.join(widgetTmpImagesPath, filename)
          let newPath = path.join('images', filename.replace(regExp, rename))
          archive.append(fs.createReadStream(oldPath), {name: newPath})
        })
      } catch (error) {

      }
    } else {
      archive
        .bulk([{
          expand: true,
          cwd: widgetTmpImagesPath,
          src: ['**', '!_build_*.css'],
          dest: 'images'
        }])
    }

    archive.finalize();

    ctx.set('Content-disposition','attachment;filename=' + wname + '.zip');
    ctx.body = archive;
    updateCounter();

  }).catch(function(err) {
    console.error(err);
    ctx.status = 404;
  });
}
