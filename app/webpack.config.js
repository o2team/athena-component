const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: {
    app: './src/app.js',
    vendor: [
      'vue',
      'vue-router',
      'vuex',
      'vue-resource',
      'vue-lazyload',
      'syntaxhighlighter',
      'brush-css',
      'brush-sass',
      'brush-javascript',
      'brush-xml'
    ]
  },
  output: {
    publicPath: '/dist/',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'node_modules/syntaxhighlighter'),
          path.resolve(__dirname, 'node_modules/brush-base')
        ]
      },
      {
        test: /\.s[a|c]ss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('style.css'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: Infinity
    })
  ],
}
