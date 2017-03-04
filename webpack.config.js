var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var env = process.env.NODE_ENV;
module.exports = {
  devtool: '#source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr',
    './src/client'
  ],
  output: {
    path: path.resolve(__dirname, './build/static'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: __dirname
      },
      { test: /\.styl$/,
        loader: ExtractTextPlugin.extract(
            'css?sourceMap!' +
            'stylus?sourceMap' + 
            'style?sourceMap'
        )
      },
      {
        test: /.(png|jpg)$/, 
        loader: 'url?limit=8192&name=img/[hash:8].[name].[ext]',
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}