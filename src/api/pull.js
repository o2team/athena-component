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

  Widget.increment(id)

  let pack = await Widget.pack(id)

  let widgetName = widget.get('name')
  let widgetPath = path.join(conf.warehouse, id)

  await util.buildWidget(id)

  const tarPath = path.join(widgetPath, `_build_${widgetName}.tgz`)

  ctx.set('Content-disposition', `attachment;filename=${rename || widgetName}.tgz`)

  if (util.existsSync(tarPath)) {
    ctx.body = fs.createReadStream(tarPath)
    return
  }

  try {
    const tar = archiver('tar', { gzip: true })
    tar.on('error', () => {
      throw err
    })

    tar.bulk([{
      expand: true,
      cwd: widgetPath,
      src: ['**', '!_*_*', '!capture.png']
    }])
    tar.pipe(fs.createWriteStream(tarPath))
    tar.finalize()

    ctx.set('Content-disposition', `attachment;filename=${rename || widgetName}.tgz`)
    ctx.body = tar
  } catch (error) {
    console.log(error)
    ctx.status = 404
  }
}
