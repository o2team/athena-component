'use strict';

const 
  os = require('os'),
  fs = require('fs'),
  path = require('path'),

	Koa = require('koa'),
  app = new Koa(),
  router = require('koa-router')(),
  serve = require('koa-static-server'),
  koaBody = require('koa-body'),

  AdmZip = require('adm-zip'),
  unzip = require('unzip'),
  UUID = require('node-uuid'),
  fstream = require('fstream'),
  mongoose = require('mongoose'),
  lodash = require('lodash'),

  conf = require('./ac-config.js');

// 连接数据库
mongoose.connect(conf.mongodb.uri, conf.mongodb.options);

var Schema = mongoose.Schema;
var WidgetSchema = new Schema({
  uuid: { type: String, unique: true },
  name: String,
  description: String,
  appId: String,
  moduleId: String,
  author: String,
  platform: String,
  pushDate: { type: Date, default: Date.now },
  pullTimes: { type: Number, default: 0 }
});
var Widget = mongoose.model('Widget', WidgetSchema);

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve({rootDir:conf.app}))
  .use(function *(next) {
    if(!this.path.match(/^\/warehouse\//)) {
      yield* next;
    } else {
      let stat = function(file) {
        return function(done) {
          fs.stat(file, done);
        }
      }
      let p = path.join(__dirname, this.path);
      let fstat = yield stat(p);
      if(fstat.isFile()) {
        this.type = path.extname(p);
        this.body = fs.createReadStream(p);
      }
    }
  });

/**
 * 组件详情
 */
router.get('/api/detail/:uuid', function *() {
  yield new Promise(resolve => {
    let that = this;
    let uuid = this.params.uuid;
    let wp = path.join(conf.warehouse, uuid);
    let wpimg = path.join(wp, 'images');
    let buildPath = path.join(conf.warehouse, '_build', uuid);
    let bimg = path.join(buildPath, 'images');
    Widget.findOne({uuid:uuid}, function (err, w) {
      if(!err && w) {
        let contHtml = fs.readFileSync( path.join(wp, w.name+'.html') ).toString();
        let contCss = fs.readFileSync( path.join(wp, w.name+'.css') ).toString();
        let contJs = fs.readFileSync( path.join(wp, w.name+'.js') ).toString();
        try {
          fs.accessSync( buildPath );
        } catch(e) {
          let commonstyle = '';
          if(w.platform==='h5') {
            // 根据AOTU代码规范重置样式
            commonstyle = `
* { -webkit-tap-highlight-color: transparent; outline: 0; margin: 0; padding: 0; vertical-align: baseline; }
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin: 0; padding: 0; vertical-align: baseline; }
img { border: 0 none; vertical-align: top; }
i, em { font-style: normal; }
ol, ul { list-style: none; }
input, select, button, h1, h2, h3, h4, h5, h6 { font-size: 100%; font-family: inherit; }
table { border-collapse: collapse; border-spacing: 0; }
a { text-decoration: none; color: #666; }
body { margin: 0 auto; min-width: 320px; max-width: 640px; height: 100%; font-size: 14px; font-family: Helvetica, STHeiti STXihei, Microsoft JhengHei, Microsoft YaHei, Arial; line-height: 1.5; color: #666; -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
input[type="text"], textarea { -webkit-appearance: none; -moz-appearance: none; appearance: none; }`;
          } else if(w.platform==='pc') {
            commonstyle = `
html, body, div, h1, h2, h3, h4, h5, h6, p, dl, dt, dd, ol, ul, li, fieldset, form, label, input, legend, table, caption, tbody, tfoot, thead, tr, th, td, textarea, article, aside, audio, canvas, figure, footer, header, mark, menu, nav, section, time, video { margin: 0; padding: 0; }
h1, h2, h3, h4, h5, h6 { font-size: 100%; font-weight: normal }
article, aside, dialog, figure, footer, header, hgroup, nav, section, blockquote { display: block; }
ul, ol { list-style: none; }
img { border: 0 none; vertical-align: top; }
blockquote, q { quotes: none; }
blockquote:before, blockquote:after, q:before, q:after { content: none; }
table { border-collapse: collapse; border-spacing: 0; }
strong, em, i { font-style: normal; font-weight: normal; }
ins { text-decoration: underline; }
del { text-decoration: line-through; }
mark { background: none; }
input::-ms-clear { display: none !important; }
body { font: 12px/1.5 \\5FAE\\8F6F\\96C5\9ED1, \\5B8B\\4F53, "Hiragino Sans GB", STHeiti, "WenQuanYi Micro Hei", "Droid Sans Fallback", SimSun, sans-serif; background: #fff; }
a { text-decoration: none; color: #333; }
a:hover { text-decoration: underline; }`;
          }
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
          iframe = lodash.template( iframe )(
            JSON.parse(fs.readFileSync(path.join(wp, w.name+'.json'))).data
          );
          // 创建编译目录
          fs.mkdirSync( buildPath );
          // HTML
          fs.writeFileSync( path.join(buildPath, 'index.html'), iframe);
          // 图片
          fs.mkdirSync( bimg );
          console.log(wpimg, bimg)
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
});

/**
 * 组件列表
 */
router.get('/api/list', function *() {
  let that = this;
  yield new Promise(resolve => {
    Widget.find({}, function (err, docs) {
      that.body = docs;
      resolve();
    });
  });
});

/**
 * POST: appId, moduleId, platform [, description, author]
 * 上传组件数据
 */
router.post('/api/push', koaBody({
  multipart: true,
  formidable:{
    uploadDir: os.tmpdir(),
    // @params 字段名 文件OBJ
    onFileBegin: function(name, file) {}
  }
}), function *() {
  yield new Promise(resolve => {
    let that = this;
    let uuid = UUID.v1();
    let fields = this.request.body.fields;
    let widget = this.request.body.files.widget;
  
    if(!widget) { this.status = 404; return; }
    
    let wname = path.basename(widget.name, '.zip');
    let distDir = path.join(conf.warehouse, uuid);
    
    fs.mkdir(distDir, function (err) {
      let readStream = fs.createReadStream( widget.path );
      let writeStream = fstream.Writer(distDir);
      
      writeStream.on('close', function() {
        // let wc = require(path.join(distDir, wname+'.json'));
        fs.readFile( path.join(distDir, wname+'.json'), function(err, data) {
          if(err) {
            console.log(err);
            that.body = '没找到配置文件';
            resolve();
          } else {
            let wc = JSON.parse(data.toString());
            let author = fields.author || wc.author || '';
            let description = fields.description || wc.description || '';
            // 默认是h5，固定h5/pc两个
            let platform = (fields.platform==='h5' || fields.platform==='pc') ? fields.platform : 'h5';
            // 存数据库
            let c = new Widget({
              uuid: uuid,
              name: wname,
              description: description,
              appId: fields.appId,
              moduleId: fields.moduleId,
              author: author,
              platform: platform
            });
            c.save(function(err) {
              if(err) {
                console.log(err);
                that.status = 500;
              } else {
                that.status = 200;
              }
              resolve();  //Resolve
            });
          }
        });
      });
  
      readStream
        .pipe(unzip.Parse())
        .pipe(writeStream);
    });
  });
});

/**
 * 通过id拉取组件打包文件
 */
router.get('/api/pull/:uuid/:rename?', function *() {
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
  Widget.update({uuid:uuid}, {$inc:{pullTimes:1}}, function(err, results) {
    if(err) throw err;
  });
});

router.get('/api/test', function *(){
  setTimeout(() => {
      this.body = 'wwww';
  }, 1000);
});

app.listen(conf.port);