let express = require('express')
let app = express()
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackOptions = require('./webpack.config')
const compiler = webpack(webpackOptions)
//compiler是webpack的实例代表整个编译的任务  compiler.run()可以执行编译
app.use(webpackDevMiddleware(compiler, {}))

app.listen(3003)
/**
 * 
 * webpack-dev-server 自己启动了一个express的http服务器，而且能实现打包的功能，并且可以提供产出文件的访问服务
 * webpack-dev-middleware 只是一个中间件 他可以被嵌入到现在的其他的express应用，提供打包功能，并且可以提供产出文件的访问服务 
 * 1.自动按配置文件的要求打包项目
 * 2.会提供打包后的文件的访问服务
 * 
 */