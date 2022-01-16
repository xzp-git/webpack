const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DonePlugin = require("./plugins/done-plugin")


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  context:process.cwd().replace(/\\/g, '/'),
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
      "babel-loader":path.resolve(__dirname, "loaders", "babel-loader"),
      "less-loader":path.resolve(__dirname, "loaders", "less-loader"),
      "style-loader":path.resolve(__dirname, "loaders", "style-loader")
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
      },
      {
        test:/\.less$/,
        use:[
          'style-loader', 'less-loader'
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
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify:{
        removeComments:true,
        collapseWhitespace:true
      }
    }),
    new DonePlugin()
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns:['**/*']
    // })
  ],
};
