const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const DonePlugin = require('./plugins/done-plugin')
const RunPlugin = require('./plugins/run-plugin')


module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: {
    entry1: './src/index1.js',
    entry2: './src/index2.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].js', // 输出文件名
  },

  devServer: {
    static: {
      directory: path.resolve('public'), // 额外的静态文件内容的目录
      publicPath: '/', // 表示打包后静态文件的文件夹 如果不写会用output中的publicPath
    },
    compress: true, // 是否启动压缩
    port: 8081, // 服务器监听的端口
    open: true, // 是否打开窗口

  },
  resolve:{
    extensions:['.js', '.jsx', '.ts', '.tsx', '.json']
  }, 
  module: {
    rules:[
      {
        test:/\.js$/,
        use:[
          path.resolve(__dirname, 'loaders/logger1.js'),
          path.resolve(__dirname, 'loaders/logger2.js')
        ]
      }
    ]
    // rules:[
    //   {
    //     test:/\.js$/,
    //     exclude:/node_modules/,
    //     use:{
    //       loader:'babel-loader',
    //       options:{
    //         plugins:[
    //           [path.resolve(__dirname, 'import.js'),
    //             {
    //               //指定需要按需加载的模块
    //               libraryName: 'lodash',
    //               //按需加载的目录，默认是lib  ''指的是根目录
    //               libraryDirectory:''
    //             }
    //           ]
              
    //         ]
    //       }
    //     }
    //   }
    // ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   minify:{
    //     removeComments:true,
    //     collapseWhitespace:true
    //   }
    // }),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns:['**/*']
    // })
  ],
};
