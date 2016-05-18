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
    Widget.findOne({uuid:uuid}, function (err, w) {
      if(!err && w) {
        let contHtml = fs.readFileSync( path.join(conf.warehouse, uuid, w.name+'.html') ).toString();
        let contCss = fs.readFileSync( path.join(conf.warehouse, uuid, w.name+'.css') ).toString();
        let contJs = fs.readFileSync( path.join(conf.warehouse, uuid, w.name+'.js') ).toString();
        that.body = {
          contHtml: contHtml,
          contCss: contCss,
          contJs: contJs
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
            // 存数据库
            let c = new Widget({
              uuid: uuid,
              name: wname,
              description: description,
              appId: fields.appId,
              moduleId: fields.moduleId,
              author: author,
              platform: fields.platform
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

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     ctx.body = { message: err.message };
//     ctx.status = err.status || 500;
//   }
// });

// app.use(async ctx => {
//   const user = await User.getById(ctx.session.userid);
//   ctx.body = user;
// });

app.listen(conf.port);