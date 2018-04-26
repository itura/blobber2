const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const rxPaths = require('rxjs/_esm2015/path-mapping')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.js'
  },
  resolve: {
    // Use the "alias" key to resolve to an ESM distribution
    alias: rxPaths()
  },
  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: [
            'transform-class-properties'
          ]
        }
      }
    }, {
      test: /.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/assets/index.html',
      filename: 'index.html',
      favicon: 'src/client/assets/favicon.ico'
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
