module.exports = process.env.NODE_ENV === 'development' ? require('./ac.dev.conf') : require('./ac.prod.conf')
