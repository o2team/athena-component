'use strict';

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const fstream = require('fstream');
const lodash = require('lodash');
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
  let widget;
  
  let id = ctx.request.query.id;
  
  if(!id) { ctx.status = 404; return; }
  
  // util.dumpLog(`访问组件 - ${ctx.ip} -> ${id}`);
  
  // 查找组件
  await new Promise(function(resolve, reject) {
    let query = new AV.Query('Widget');
    query.get(id).then(function (data) {
      widget = data;
      resolve();
    }, function (err) {
      console.error(err);
    });
  });

  // 组件路径
  let widgetTempPath = path.join(conf.warehouse, '_temp', widget.id);
  
  // 解压文件
  await util.unzipWidget( widget.id ).catch(function(err) {
    console.error(err);
  });
  
  // 编译组件
  await util.buildWidget( widget.id, widget)
  .then(function(integrate) {
    // Response
    ctx.body = {
      contHtml: integrate.contHtml,
      contBuiltHtml: integrate.contBuiltHtml,
      contScss: integrate.contScss,
      contBuiltCss: integrate.contBuiltCss,
      contCss: integrate.contScss ? '' : integrate.contCss, // 如果SCSS存在就忽略CSS（这时的CSS可能是组件上传前编译的）
      contJs: integrate.contJs,
      contJson: integrate.contJson,
      widget: widget
    }
  })
  .catch(function(err) {
    console.error(err);
    ctx.status = 404;
  });
}