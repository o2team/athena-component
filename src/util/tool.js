import { Widget } from '../dao'
const fs = require('fs')
const path = require('path')
const os = require('os')
const fse = require('fs-extra')
const fstream = require('fstream')
const lodash = require('lodash')
const phantom = require('phantom')
const fsz = require('./fsz')
const decompress = require('decompress')
const decompressTargz = require('decompress-targz')
const conf = require('../config/config.js')

// 获取格式化时间
function getFormatDate (date = new Date(), sep = '-') {
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate() + 1}`.slice(-2)
  const hour = `0${date.getHours()}`.slice(-2)
  const minute = `0${date.getMinutes()}`.slice(-2)
  const second = `0${date.getSeconds()}`.slice(-2)

  return `${year}${sep}${month}${sep}${day} ${hour}:${minute}:${second}`
}

// 写日志
function dumpLog (msgText) {
  if (!msgText) {
    return
  }
  let ts = new Date().toISOString().replace(/T.+/, '')
  let logFile = path.join(conf.logsDir, `${ts}.log`)
  let logStr = `${getFormatDate()} - ${msgText}\n`
  fs.appendFileSync(logFile, logStr)
}

/**
 * 解压缩组件
 * 组件额外文件构成
 *  - _imports
 *  - _build_timestamp
 *  - _build_integrate
 *  - _preview_index.html
 *  - _build_xxx.html
 *  - _build_xxx.css
 *  - _build_xxx.js
 *  - _build_xxx.tgz
 *  - capture.png
 * @param {id} <String>
 */
async function buildWidget (id, isPush) {
  if (!id) {
    return
  }

  const widget = await Widget.get(id)

  if (!widget) {
    reject('没有提供组件ID')
    return
  }

  const widgetName = widget.get('name')
  const widgetPath = path.join(conf.warehouse, id)

  // ----- 1. 解压组件 -----
  return new Promise(async (resolve, reject) => {
    const timestampPath = path.join(widgetPath, '_build_timestamp')
    const downPackName = Date.now().toString()
    const downPackPath = path.join(os.tmpdir(), `${downPackName}.tgz`)
    const downPackStream = fs.createWriteStream(downPackPath)

    function _unzipWidget () {
      return new Promise(async (resolve, reject) => {
        const pack = await Widget.pack(id)
        pack.pipe(downPackStream)
        downPackStream.on('finish', () => {
          decompress(downPackPath, widgetPath, {
            plugins: [decompressTargz()]
          }).then(() => {
            fs.writeFileSync(timestampPath, widget.get('stamp').getTime())
            resolve()
          })
        })
      })
    }
    if (fsz.existsSync(widgetPath)) {
      if (!fsz.existsSync(timestampPath)) {
        fse.removeSync(widgetPath)
        await _unzipWidget()
      } else {
        const timestamp = fs.readFileSync(timestampPath, 'utf-8')
        const isLatest = await Widget.checkLatest(id, timestamp)
        if (!isLatest) {
          fse.removeSync(widgetPath)
          await _unzipWidget()
        }
      }
    } else {
      await _unzipWidget()
    }

    resolve()
  }).then(() => {
    // ----- 2. 编译组件 -----
    return new Promise(async (resolve, reject) => {
      const integratePath = path.join(widgetPath, '_build_integrate')

      if (fsz.existsSync(integratePath)) {
        resolve(JSON.parse(fs.readFileSync(integratePath).toString()))
        return
      }

      let integrate = {}
      let contHtml, contScss, contCss, contJs, contJson
      let contBuiltHtml, contBuiltCss

      let contCapturePath = path.join(widgetPath, 'capture.png')
      let contPreviewPath = path.join(widgetPath, '_preview_index.html')

      // --- --- --- --- ---

      let contHtmlPath = path.join(widgetPath, `${widgetName}.html`)
      let contScssPath = path.join(widgetPath, `${widgetName}.scss`)
      let contCssPath = path.join(widgetPath, `${widgetName}.css`)
      let contJsPath = path.join(widgetPath, `${widgetName}.js`)
      let contJsonPath = path.join(widgetPath, `${widgetName}.json`)

      let contBuiltHtmlPath = path.join(widgetPath, `_build_${widgetName}.html`)
      let contBuiltCssPath = path.join(widgetPath,  `_build_${widgetName}.css`)

      // --- --- --- --- ---

      try {contHtml = fs.readFileSync(contHtmlPath).toString(); integrate.contHtml = contHtml} catch (err) {}
      try {contScss = fs.readFileSync(contScssPath).toString(); integrate.contScss = contScss} catch (err) {}
      try {contCss = fs.readFileSync(contCssPath).toString(); integrate.contCss = contCss} catch (err) {}
      try {contJs = fs.readFileSync(contJsPath).toString(); integrate.contJs = contJs} catch (err) {}
      try {contJson = fs.readFileSync(contJsonPath).toString(); integrate.contJson = contJson} catch (err) {}

      // @todo athena 本地编译有误
      // try {
      //   contBuiltHtml = fs.readFileSync(contBuiltHtmlPath).toString()
      //   contBuiltHtml = (contBuiltHtml || '').replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '')
      //   integrate.contBuiltHtml = contBuiltHtml
      // } catch (err) {}
      try {contBuiltCss = fs.readFileSync(contBuiltCssPath).toString(); integrate.contBuiltCss = contBuiltCss} catch (err) {}

      if (!contHtml) {
        fs.writeFileSync(integratePath, JSON.stringify(integrate))
        resolve(integrate)
        return
      }

      // 如果无已编译好的文件
      if (!contBuiltHtml) {
        contHtml = contHtml.replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '')
        let manualData
        try {
          // 清除配置文件中的注释
          let regExp = new RegExp('(/\\\*([^*]|[\\\r\\\n]|(\\\*+([^*/]|[\\\r\\\n])))*\\\*+/)|(//.*)', 'g')
          contJson = contJson.replace(regExp, '')
          let wconf = JSON.parse(contJson)
          let wdata = wconf.data
          let wdataList = wconf.dataList
          if (wdataList instanceof Array && wdataList.length > 0) {
            manualData = wdataList
          } else if (wdata) {
            manualData = [wdata]
          } else {
            // 因为至少至少要有一次无参数编译
            manualData = [{}]
          }
        } catch (error) {
          console.error(error, new Date() + ' JSON parse error')
          manualData = [{}]
        }
        try {
          integrate.contBuiltHtml = ''
          contBuiltHtml = ''
          manualData.forEach(function (dataItem) {
            contBuiltHtml = contBuiltHtml + lodash.template(contHtml)(dataItem)
          })
          integrate.contBuiltHtml = contBuiltHtml
        } catch (error) {
          console.error('模板渲染错误：' + error)
        }
      }

      // 提前返回
      resolve(integrate)
      fs.writeFileSync(integratePath, JSON.stringify(integrate))

      if (!fsz.existsSync(contPreviewPath)) {
        // 写预览 html
        contBuiltHtml  = (contBuiltHtml || '').replace('<% widget.scriptStart() %>', '').replace('<% widget.scriptEnd() %>', '')
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
<body ontouchstart>
${contBuiltHtml}
<script>${contJs}</script>
</body>
</html>`
        fs.writeFileSync(contPreviewPath, iframe)
      }

      // 网页截图
      if (!fsz.existsSync(contCapturePath)) {
        let instance = await phantom.create(['--ignore-ssl-errors=true', '--local-to-remote-url-access=true'])
        let page = await instance.createPage()
        await page.property('viewportSize', {width: 375, height: 375})
        await page.open('file:///' + path.resolve(`${conf.warehouse}/${id}/_preview_index.html`))
        await page.render(contCapturePath)
        instance.exit()
      }
    })
  }).catch((error) => {
    fse.remove(widgetPath)
  })
}

module.exports = {
  getFormatDate,
  dumpLog,
  buildWidget
}
