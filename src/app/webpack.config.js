var path = require('path');

// 单前端调试
// module.exports = {
//   entry: ['./main.js'],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'bundle.js',
//     publicPath: '/dist/'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.vue$/, // a regex for matching all files that end in `.vue`
//         loader: 'vue'   // loader to use for matched files
//       },
//       {
//         test: /\.js$/,
//         loader: 'babel',
//         exclude: /node_modules/
//       },
//       {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
//     ]
//   },
//   babel: {
//     presets: ['es2015', 'stage-0'],
//     plugins: ['transform-runtime']
//   }
// }

//-----------------------------------------

// 前后端联调
module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    './main.js'
  ],
  output: {
    path: './dist/',
    filename: 'bundle.js',
    publicPath: 'http://0.0.0.0:8080/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/, // a regex for matching all files that end in `.vue`
        loader: 'vue'   // loader to use for matched files
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}