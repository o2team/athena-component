module.exports = function fmtDateNormal (text) {
  var past = new Date(text)

  if (past === 'Invalid Date') {
    return ''
  }

  var now = new Date()
  var septime = now.getTime() - past.getTime()

  // 大于7天
  if (septime > 604800000) {
    if (now.getFullYear() - past.getFullYear() > 0) {
      return past.getFullYear() + '年' + (past.getMonth() + 1) + '月' + past.getDate() + '日'
    } else {
      return (past.getMonth() + 1) + '月' + past.getDate() + '日'
    }
  } else if (septime > 86400000) {
    return Math.floor(septime / 86400000) + '天前'
  } else if (septime > 3600000) {
    return Math.floor(septime / 3600000) + '小时前'
  } else if (septime > 60000) {
    return Math.floor(septime / 60000) + '分钟前'
  } else {
    console.log(septime)
    return Math.floor(septime / 1000) + '秒前'
  }
}
