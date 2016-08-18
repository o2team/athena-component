'use strict';

const fs = require('fs');
const path = require('path');
const unzip = require('unzip');
const fstream = require('fstream');
const lodash = require('lodash');
const AV = require('leancloud-storage');
const conf = require('../ac-config.js');

const APP_ID = conf.leancloud.APP_ID;
const APP_KEY = conf.leancloud.APP_KEY;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

module.exports = async (ctx, next) => {
  let widget, contHtml, contScss, contCss, contJs, contJson;
  
  let id = ctx.request.query.id;
  
  if(!id) { ctx.status = 404; return; }

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
  let widgetPath = path.join(conf.warehouse, '_temp', widget.id);
  try {
    fs.accessSync( widgetPath );
  } catch(err) {
    // 创建
    fs.mkdirSync( widgetPath );
    // 解压缩组件
    await new Promise(function(resolve, reject) {
      let readStream = fs.createReadStream( path.join( conf.warehouse, widget.id ) );
      let writeStream = fstream.Writer( widgetPath );
      readStream
        .pipe(unzip.Parse())
        .pipe(writeStream);
      writeStream.on('close', function() {
        resolve();
      });
    });
  }

  // 组件图片路径
  let widgetImgPath = path.join(widgetPath, 'images');
  // 组件编译路径
  let widgetBuildPath = path.join(conf.warehouse, '_build', widget.id);
  // 组件编译图片路径
  let widgetBuildImgPath = path.join(widgetBuildPath, 'images');
  // 组件HTML路径
  let contHtmlPath = path.join(widgetPath, widget.get('name')+'.html');
  // 组件SCSS路径
  let contScssPath = path.join(widgetPath, widget.get('name')+'.scss');
  // 组件CSS路径
  let contCssPath = path.join(widgetPath, widget.get('name')+'.css');
  // 组件JS路径
  let contJsPath = path.join(widgetPath, widget.get('name')+'.js');
  // 组件JSON路径
  let contJsonPath = path.join(widgetPath, widget.get('name')+'.json');

  // 读取组件 HTML, SCSS, CSS, JS
  try {contHtml = fs.readFileSync( contHtmlPath ).toString();} catch(err) { /* DO NOTHING */ }
  try {contScss = fs.readFileSync( contScssPath ).toString();} catch(err) { /* DO NOTHING */ }
  try {contCss = fs.readFileSync( contCssPath ).toString();} catch(err) { /* DO NOTHING */ }
  try {contJs = fs.readFileSync( contJsPath ).toString();} catch(err) { /* DO NOTHING */ }
  try {contJson = fs.readFileSync( contJsonPath ).toString();} catch(err) { /* DO NOTHING */ }

  // 编译任务，遵循AOTU代码规范
  // 只有在html文件存在时才进行编译
  if(contHtml) {
    try {
      fs.accessSync( widgetBuildPath );
    } catch(err) {
      let commonstyle = conf.tpl[`css${widget.get('platform')}`] || '';
      let iframe = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Document</title>
<style>
  ${commonstyle}
  ${contCss}
</style>
</head>
<body>
  ${contHtml}
<script>
  ${contJs}
</script>
</body>
</html>`;
      iframe = iframe.replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '');
      try {
        // 根据配置里的虚拟变量进行基本编译
        iframe = lodash.template( iframe )(
          JSON.parse(fs.readFileSync(path.join(widgetPath, widget.get('name')+'.json'))).data
        );
      } catch(err) {
        console.error('模板渲染错误：' + err);
      }
  
      // 创建编译目录
      fs.mkdirSync( widgetBuildPath );
      fs.mkdirSync( widgetBuildImgPath );
      fs.writeFileSync( path.join(widgetBuildPath, 'index.html'), iframe);
      await new Promise(function(resolve, reject) {
        let writer = fstream.Writer( widgetBuildImgPath );
        fstream
          .Reader( widgetImgPath )
          .pipe( writer );
        writer.on('close', function() {
          resolve();
        });
      });
    }
  }
  
  // Response
  ctx.body = {
    contHtml: contHtml,
    contScss: contScss,
    contCss: contScss ? '' : contCss, // 如果SCSS存在就忽略CSS（这时的CSS可能是组件上传前编译的）
    contJs: contJs,
    contJson: contJson,
    widget: widget
  }
}