/* @flow */
import http from 'http'
import koa from 'koa'
import path from 'path'
import views from 'koa-views'
import staticServer from 'koa-static'

import React from 'react'
import { renderToString } from 'react-dom/server'
import Index from './index'

const app = koa()
app.use(errorHandler)
app.use(pageNotfound)
app.use(logger)

var webpack = require('webpack');
var webpackDevMiddleware = require('koa-webpack-dev-middleware');
var webpackHotMiddleware = require('koa-webpack-hot-middleware');
var config = require('../webpack.config.js');
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true
}));
app.use(webpackHotMiddleware(compiler));

app.use(views(path.join(__dirname, '../views'), {
  map: { html: 'ejs' }
}))
app.use(staticServer(path.join(__dirname, '/static')));
app.use(function *() {
  const content = renderToString(<Index />)
  yield this.render('index', { content })
});

http.createServer(app.callback()).listen(3000, function(err){
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:3000');
});

// error handler
function *errorHandler(next: Object) {
  try {
    yield next
  } catch (err) {
    this.status = err.status || 500
    this.body = err.message
    console.log(`${this.method} => ${this.url} => ${err.stack}`)
    switch (this.accepts('html', 'json')) {
    case 'html':
      yield this.render('error', {
        message: err.message,
        status: err.status || 500,
        error: err
      })
      break
    case 'json':
      this.body = {
        status: '404',
        message: 'Page Not Found'
      }
      break
    default:
      this.type = 'text'
      this.body = 'Page Not Found'
    }
  }
}

// x-response-time + logger
function *logger(next: Object) {
  const start = new Date
  yield next
  const delta = new Date - start
  this.set('X-Response-Time', delta + 'ms')
  console.log(`${this.method} => ${this.url} ::: ${delta}ms`)
}

// 404
function *pageNotfound(next: Object) {
  yield next
  if (404 != this.status) return
  this.status = 404
  this.throw('Page Not Found', 404)
}
