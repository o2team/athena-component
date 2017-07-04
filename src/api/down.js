import { Widget } from '../dao'
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const conf = require('../config/config.js')
const util = require('../util')

module.exports = async (ctx, next) => {
  let id = ctx.params.id
  let rename = ctx.params.rename ? ctx.params.rename.trim() : ''

  let widget = await Widget.get(id)
  if (!widget) {
    ctx.status = 404
    return
  }
  // 兼容舊id
  id = widget.id

  Widget.increment(id)

  let pack = await Widget.pack(id)

  let widgetName = widget.get('name')
  let widgetPath = path.join(conf.warehouse, id)
  let widgetImagesPath = path.join(widgetPath, 'images')

  const integrate = await util.buildWidget(id)

  try {
    const archive = archiver('tar', { gzip: true })

    archive.on('error', (err) => {
      throw err
    })

    let realName = widget.get('name')
    let wname = rename || realName
    let regExp = new RegExp(realName, 'g')

    // 重命名
    if (rename) {
      integrate.contBuiltHtml = integrate.contBuiltHtml ? integrate.contBuiltHtml.replace(regExp, rename) : ''
      integrate.contBuiltCss = integrate.contBuiltCss ? integrate.contBuiltCss.replace(regExp, rename) : ''
      integrate.contCss = integrate.contCss ? integrate.contCss.replace(regExp, rename) : ''
      integrate.contJs = integrate.contJs ? integrate.contJs.replace(regExp, rename) : ''
    }

    integrate.contBuiltHtml && archive.append(new Buffer(integrate.contBuiltHtml), {name: `${wname}.html`})
    integrate.contBuiltCss && archive.append(new Buffer(integrate.contBuiltCss), {name: `${wname}.css`})
    integrate.contCss && !integrate.contBuiltCss && archive.append(new Buffer(integrate.contCss), {name: `${wname}.css`})
    integrate.contJs && archive.append(new Buffer(integrate.contJs), {name: `${wname}.js`})

    if (rename) {
      let files = fs.readdirSync(widgetImagesPath)
      files.forEach((filename) => {
        let oldPath = path.join(widgetImagesPath, filename)
        let newPath = path.join('images', filename.replace(regExp, rename))
        archive.append(fs.createReadStream(oldPath), {name: newPath})
      })
    } else {
      archive.directory(widgetImagesPath, 'images')
    }

    archive.finalize()

    ctx.set('Content-disposition', `attachment;filename=${wname}.tgz`)
    ctx.body = archive
  } catch (error) {
    console.log(error)
    ctx.status = 404
  }
}
