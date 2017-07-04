const base = require('./ac.base.conf')

module.exports = Object.assign({}, base, {
  port: process.env.PORT || 80,

  leancloud: {
    APP_ID: 'au4n3kqk359vDNoUWJHe3pJ2-gzGzoHsz',
    APP_KEY: 'k7F8i5aRninXmrUpdR5CCEBI'
  }
})
