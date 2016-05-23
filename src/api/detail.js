'use strict';

const
	fs = require('fs'),
	path = require('path'),
	fstream = require('fstream'),
  lodash = require('lodash'),
	conf = require('../ac-config.js'),
	db = require('../db.js');

module.exports = function *() {
  yield new Promise(resolve => {
    let that = this;
    let uuid = this.params.uuid;
    let wp = path.join(conf.warehouse, uuid);
    let wpimg = path.join(wp, 'images');
    let buildPath = path.join(conf.warehouse, '_build', uuid);
    let bimg = path.join(buildPath, 'images');
    db.Widget.findOne({uuid:uuid}, function (err, w) {
      if(!err && w) {
        let contHtml = fs.readFileSync( path.join(wp, w.name+'.html') ).toString();
        let contCss = fs.readFileSync( path.join(wp, w.name+'.css') ).toString();
        let contJs = fs.readFileSync( path.join(wp, w.name+'.js') ).toString();
        try {
          fs.accessSync( buildPath );
        } catch(e) {
          // 根据AOTU代码规范重置样式
          let commonstyle = conf.tpl[`css${w.platform}`] || '';
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
            iframe = lodash.template( iframe )(
              JSON.parse(fs.readFileSync(path.join(wp, w.name+'.json'))).data
            );
          } catch (e) {
            console.log(e);
          }
          // 创建编译目录
          fs.mkdirSync( buildPath );
          // HTML
          fs.writeFileSync( path.join(buildPath, 'index.html'), iframe);
          // 图片
          fs.mkdirSync( bimg );
          fstream
            .Reader( wpimg )
            .pipe( fstream.Writer( bimg ) );
        }
        that.body = {
          contHtml: contHtml,
          contCss: contCss,
          contJs: contJs,
          widget: w
        }
        resolve();
      }
    });
  });
}