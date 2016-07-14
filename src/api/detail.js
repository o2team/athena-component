'use strict';

const
	fs = require('fs'),
	path = require('path'),
	fstream = require('fstream'),
  lodash = require('lodash'),
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = async (ctx, next) => {
  let uuid = ctx.request.query.uuid;
  
  if(!uuid) { ctx.status = 404; }

  let widgetPath = path.join(conf.warehouse, uuid);
  let widgetImgPath = path.join(widgetPath, 'images');
  let widgetBuildPath = path.join(conf.warehouse, '_build', uuid);
  let widgetBuildImgPath = path.join(widgetBuildPath, 'images');

  // 查找数据库，如无返回null
  let widget = await db.Widget.findOne({uuid:uuid});
  if(!widget) { ctx.status = 404; }

  // 读取组件 HTML, CSS, JS
  let contHtml = fs.readFileSync( path.join(widgetPath, widget.name+'.html') ).toString();
  let contCss = fs.readFileSync( path.join(widgetPath, widget.name+'.css') ).toString();
  let contJs = fs.readFileSync( path.join(widgetPath, widget.name+'.js') ).toString();

  // 编译任务，遵循AOTU代码规范
  try {
    fs.accessSync( widgetBuildPath );
  } catch(err) {
    let commonstyle = conf.tpl[`css${widget.platform}`] || '';
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
        JSON.parse(fs.readFileSync(path.join(widgetPath, widget.name+'.json'))).data
      );
    } catch(err) {
      console.log(err);
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

  // Response
  ctx.body = {
    contHtml: contHtml,
    contCss: contCss,
    contJs: contJs,
    widget: widget
  }
}