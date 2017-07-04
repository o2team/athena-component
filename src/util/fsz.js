const fs = require('fs')

/**
 * 判断路径是否存在（虽然文档不推荐在读写前用它判断）
 */
function existsSync (pd) {
  try {
    fs.accessSync(pd)
    return true
  } catch(error) {
    return false
  }
}

module.exports = {
  existsSync
}
