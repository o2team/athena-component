const base = require('./ac.base.conf')

module.exports = Object.assign({}, base, {
  port: process.env.PORT || 80,

  leancloud: {
    APP_ID: 'ULAaHI9Bor3WJHCfORaRJ4BW-gzGzoHsz',
    APP_KEY: 'pRYLYgk6yk3aK2G9tNOWhd46'
  }
})
