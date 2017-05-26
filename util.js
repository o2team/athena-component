const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const unzip = require('unzip')
const fstream = require('fstream')
const lodash = require('lodash')
const phantom = require('phantom')
const conf = require('./config/config.js')

function getDate () {
  let ts = new Date()
  return ts.getFullYear() + '-' +
    ('0' + (ts.getMonth() + 1)).slice(-2) + '-' +
    ('0' + (ts.getDate() + 1)).slice(-2) + ' ' +
    ('0' + ts.getHours()).slice(-2) + ':' +
    ('0' + ts.getMinutes()).slice(-2) + ':' +
    ('0' + ts.getSeconds()).slice(-2)
}

// 文件是否存在
exports.existsSync = function (pd) {
  try {
    fs.accessSync(pd)
    return true
  } catch(err) {
    return false
  }
}

/**
 * 解压缩组件
 * @param {id} <String>
 */
exports.unzipWidget = function (id, isPush) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('没有提供组件ID')
      return
    }

    // 组件路径
    let widgetPath = path.join(conf.warehouse, id)
    let widgetTempPath = path.join(conf.warehouse, '_temp', id)

    const rollback = function () {
      fse.remove(widgetTempPath, function (err) {
        if (err) {
          console.error(err)
        }
      })
    }

    if (this.existsSync(widgetTempPath)) {
      if (isPush) {
        try {fse.removeSync(widgetTempPath)} catch (error) {}
      } else {
        resolve()
        return
      }
    }

    try {
      fs.mkdirSync(widgetTempPath)
    } catch (err) {
      reject(err)
      return
    }

    // 解压缩组件
    let readStream = fs.createReadStream(widgetPath)
    let writeStream = fstream.Writer(widgetTempPath)

    try {
      readStream
        .pipe(unzip.Parse())
        .pipe(writeStream)
      readStream.on('error', function (err) {
        reject(err)
        rollback()
      })
      writeStream.on('close', function () {
        resolve()
      })
    } catch (err) {
      reject(err)
      console.error(err)
      rollback()
    }
  })
}

/**
 * 编译组件 = 组合放到iframe的html文件，编译相关数据读写，截图
 * @param {id} <String>
 * @param {widget} <Object> Leancloud 查询对象
 */
exports.buildWidget = function (id, widget, isPush) {
  return new Promise(async (resolve, reject) => {
    if (!id) {
      reject('没有提供组件ID')
      return
    }

    // 编译路径
    const widgetBuiltPath = path.join(conf.warehouse, '_build', id)
    // 编译图片路径
    const widgetBuiltImgPath = path.join(widgetBuiltPath, 'images')
    // 编译整合信息文件（为减少文件读写次数而生）（也许我还可以把它写到数据库里）
    const widgetBuiltIntegratePath = path.join(widgetBuiltPath, 'integrate.json')
    // 编译预览HTML路径
    const widgetBuiltHtmlPath = path.join(widgetBuiltPath, 'index.html')
    // 编译截图路径
    const widgetBuiltCapturePath = path.join(widgetBuiltPath, 'capture.png')

    // 如果有，直接返回
    if (this.existsSync(widgetBuiltIntegratePath)) {
      if (isPush) {
        // fse.removeSync(widgetBuiltPath)
        try {fse.emptyDirSync(widgetBuiltPath)} catch (error) {}
      } else {
        resolve(JSON.parse(fs.readFileSync(widgetBuiltIntegratePath).toString()))
        return
      }
    }

    // 定义 回滚处理
    const rollback = function () {
      fse.remove(widgetBuiltPath, function (err) {
        if (err) {
          console.error(err)
        }
      })
    }
    // 定义 写整合文件
    const writeIntegrate = function (integrate) {
      try {
        fs.writeFileSync(widgetBuiltIntegratePath, JSON.stringify(integrate))
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    }

    // 创建编译目录
    try {
      fse.emptyDirSync(widgetBuiltPath)
      fse.emptyDirSync(widgetBuiltImgPath)
    } catch (err) {
      reject(err)
      console.error(err)
      rollback(err)
      return
    }

    // 所有内容整合到一个文件
    let integrate = {}
    let contHtml, contBuiltHtml, contScss, contBuiltCss, contCss, contJs, contJson
    // 解压路径
    let widgetTempPath = path.join(conf.warehouse, '_temp', id)
    // 解压图片路径
    let widgetTempImgPath = path.join(widgetTempPath, 'images')
    // 解压HTML路径
    let contHtmlPath = path.join(widgetTempPath, widget.get('name') + '.html')
    // 解压SCSS路径
    let contScssPath = path.join(widgetTempPath, widget.get('name') + '.scss')
    // 解压CSS路径 - 优先用编译好的CSS文件
    let contBuiltCssPath = path.join(widgetTempPath,  '_build_' + widget.get('name') + '.css')
    let contCssPath = path.join(widgetTempPath, widget.get('name') + '.css')
    // 解压JS路径
    let contJsPath = path.join(widgetTempPath, widget.get('name') + '.js')
    // 解压JSON路径
    let contJsonPath = path.join(widgetTempPath, widget.get('name') + '.json')
    // 解压截图文件路径（如果有）
    let contCapturePath = path.join(widgetTempPath, 'capture.png')

    // 读取组件 HTML, SCSS, CSS, JS
    try {contHtml = fs.readFileSync(contHtmlPath).toString(); integrate.contHtml = contHtml;} catch (err) {}
    try {contScss = fs.readFileSync(contScssPath).toString(); integrate.contScss = contScss;} catch (err) {}
    try {contBuiltCss = fs.readFileSync(contBuiltCssPath).toString(); integrate.contBuiltCss = contBuiltCss;} catch (err) {}
    try {contCss = fs.readFileSync(contCssPath).toString(); integrate.contCss = contCss;} catch (err) {}
    try {contJs = fs.readFileSync(contJsPath).toString(); integrate.contJs = contJs;} catch (err) {}
    try {contJson = fs.readFileSync(contJsonPath).toString(); integrate.contJson = contJson;} catch (err) {}

    // 如果没有HTML就没必要编译
    if (!contHtml) {
      if (!writeIntegrate(integrate)) {
        rollback()
        // 此处虽然写失败，不需要return中断，因为内容仍存在变量中
      }
      resolve(integrate)
      return
    }

    // HTML编译，变量在配置文件的 dataList/data 字段提供
    contHtml = contHtml.replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '')
    let manualData
    try {
      // 清除配置文件中的注释
      let regExp = new RegExp('(/\\\*([^*]|[\\\r\\\n]|(\\\*+([^*/]|[\\\r\\\n])))*\\\*+/)|(//.*)', 'g')
      contJson = contJson.replace(regExp, '')
      let wconf = JSON.parse(contJson)
      let wdata = wconf.data
      let wdataList = wconf.dataList
      if(wdataList instanceof Array && wdataList.length>0) {
        manualData = wdataList
      } else if (wdata) {
        manualData = [wdata]
      } else {
        // 因为至少至少要有一次无参数编译
        manualData = [{}]
      }
    } catch (err) {
      console.error(err, new Date() + ' JSON parse error')
      manualData = [{}]
    }
    try {
      integrate.contBuiltHtml = ''
      contBuiltHtml = ''
      manualData.forEach(function (dataItem) {
        contBuiltHtml = contBuiltHtml + lodash.template(contHtml)(dataItem)
        integrate.contBuiltHtml = contBuiltHtml
      })
    } catch (err) {
      console.error('模板渲染错误：' + err)
    }

    // 提前返回
    resolve(integrate)

    // 写整合文件
    if (!writeIntegrate(integrate)) {
      rollback()
      return
    }

    // 写预览HTML文件
    let commonstyle = conf.tpl[`css${widget.get('platform')}`] || ''
    let iframe = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="format-detection" content="telephone=no">
<title>Document</title>
<style>${commonstyle}${contBuiltCss || contCss || ''}</style>
<script>!function(){var o=768;document.write('<style id="o2HtmlFontSize"></style>');var e,t=function(){var e,t;if(document&&document.documentElement&&(e=document.documentElement.clientWidth,t=document.documentElement.clientHeight),!e||!t){if(!window.localStorage["o2-cw"]||!window.localStorage["o2-ch"])return void n();e=parseInt(window.localStorage["o2-cw"]),t=parseInt(window.localStorage["o2-ch"])}var c=o&&e>o?o/375:e/375;window.localStorage["o2-cw"]=e,window.localStorage["o2-ch"]=t,window.zoom=window.o2Zoom=c,document.getElementById("o2HtmlFontSize").innerHTML="html{font-size:"+20*c+"px;}.o2-zoom,.zoom{zoom:"+c/2+";}.o2-scale{-webkit-transform: scale("+c/2+"); transform: scale("+c/2+");}"},n=function(){e||(e=setInterval(function(){document&&document.documentElement&&document.documentElement.clientWidth&&document.documentElement.clientHeight&&(t(),clearInterval(e),e=void 0)},100))};t(),window.addEventListener("resize",t)}();</script>
</head>
<body>
${contBuiltHtml}
<script>${contJs}</script>
</body>
</html>`
    try {
      fs.writeFileSync(widgetBuiltHtmlPath, iframe)
    } catch (err) {
      console.error(err)
      rollback(err)
      return
    }

    // 复制图片
    let reader = fstream.Reader(widgetTempImgPath)
    let writer = fstream.Writer(widgetBuiltImgPath)
    reader.pipe(writer)
    reader.on('error', function () {
      rollback()
    })
    writer.on('close', function () {})

    // 网页截图，如果用户自己提供了截图就不自动截图了
    if(this.existsSync(contCapturePath)) {
      fse.copy(contCapturePath, widgetBuiltCapturePath, function (err) {
        if (err) {
          rollback()
          console.error(err)
        }
      })
    } else {
      let instance = await phantom.create(['--ignore-ssl-errors=true', '--local-to-remote-url-access=true'])
      let page = await instance.createPage()
      await page.property('viewportSize', {width: 375, height: 375})
      await page.open('file:///' + path.resolve(`${conf.warehouse}/_build/${id}/index.html`))
      await page.render(widgetBuiltCapturePath)
      instance.exit()
    }
  })
}

exports.dumpLog = function (msgText) {
  if (!msgText) {
    return
  }
  let ts = new Date().toISOString().replace(/T.+/, '')
  let logFile = path.join(conf.logsDir, `${ts}.log`)
  let logStr = `${getDate()} - ${msgText}\n`
  fs.appendFileSync(logFile, logStr)
}
