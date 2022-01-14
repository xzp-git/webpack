const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin")


module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: {
    main: './src/index1.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].js', // 输出文件名
  },

  resolve:{
    extensions:['.js', '.jsx', '.ts', '.tsx', '.json']
  }, 
  resolveLoader:{
    alias:{
      "babel-loader":path.resolve(__dirname, "loaders", "babel-loader")
    },
    modules:['node_modules', path.resolve(__dirname, 'loaders')]
  },
  module: {
    rules:[
      {
        test:/\.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env'], //套餐
            plugins:[] //单点
          }
        }
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
