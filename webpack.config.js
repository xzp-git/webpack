const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // mode:'none',
    // mode:process.env.NODE_ENV,
    mode:'development',
    devtool:false,
    // entry:'./src/index.js'
    entry:{
        main:'./src/index.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'), //输出目录
        filename:'main.js', //输出文件名
        // publicPath:'/'
        // publicPath:'/assets' //表示打包生成的index.html文件里引用资源的前缀
    },
    //express启动一个http服务器 通过它可以访问产出的文件
    devServer:{
        static: {
            directory: path.resolve('public'),//额外的静态文件内容的目录
            publicPath: '/', //表示打包后静态文件的文件夹 如果不写会用output中的publicPath
          },
        compress:true, //是否启动压缩
        port:8081,//服务器监听的端口
        open:true//是否打开窗口

    },
    module:{
        rules:[
            {
                test:/\.txt$/,
                use:'raw-loader'//loader就是把webpack不认识的 转换为认识的      
            },
            {
                test:/\.css$/,
                use:[ //use 使用数组时 返回的一定是JS 交给webpack  webpack只能打包认识js json 
                    'style-loader', //把css转成js 交给webpack
                    {
                        loader:'css-loader', //作用 处理css中的 url  @import 交给 style-loader
                        options:{
                             importLoaders:1,
                            //  modules:{
                            //     mode: "local",
                            //     // auto: true,
                            //     // exportGlobals: true,
                            //     localIdentName: "[path][name]__[local]--[hash:base64:5]",
                            //     // localIdentContext: path.resolve(__dirname, "src"),
                            //     // localIdentHashSalt: "my-custom-hash",
                            //     // namedExport: true,
                            //     // exportLocalsConvention: "camelCase",
                            //     // exportOnlyLocals: false,
                            //  }
                        }
                    },
                    'postcss-loader' //css 添加浏览器厂商的前缀
                ]
            },
            {
                test:/\.less$/,
                use:[ //use 使用数组时 返回的一定是JS 交给webpack  webpack只能打包认识js json 
                    'style-loader', //把css转成js 交给webpack
                    {
                        loader:'css-loader', //作用 处理css中的 url  @import 交给 style-loader
                        options:{
                             importLoaders:1
                        }
                    },
                    'less-loader'// 通过less把less编译成 css
                ]
            },
            {
                test:/\.scss$/,
                use:[ //use 使用数组时 返回的一定是JS 交给webpack  webpack只能打包认识js json 
                    'style-loader', //把css转成js 交给webpack
                    {
                        loader:'css-loader', //作用 处理css中的 url  @import 交给 style-loader
                        options:{
                             importLoaders:1
                        }
                    },
                    'sass-loader'// 通过dart-sass把less编译成 css
                ]
            },

            {
                test:/\.(jpg|png|gif|bmp|svg)$/,
                type:'asset/resource',
                generator:{
                    filename:'[hash][ext]'
                }
            }
            // {
            //     test:/\.(jpg|png|gif|bmp|svg)$/,
            //     use:[
            //         {
            //             loader:'url-loader',
            //             options:{
            //                 esModule:false,
            //                 limit: 8 * 1024 //以8K为分界线，如果引入的文件小于8K，就把图片变成base64字符串插入html，否则和file-loader一样
            //             }
            //         },
            //         // {
            //         //     loader:'file-loader',
            //         //     options:{
            //         //         esModule:false,
            //         //         name:'[hash:10].[ext]'
            //         //     }
            //         // }
            //     ]
            // }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        })
    ]
}

// module.exports = (env, arg) => {

//     console.log(env);
//     console.log(arg);
//     /**
//      * { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }
//         {
//         env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }
//         }
//      */

//     return{
//         // mode:'none',
//         mode:env.production?'production':'development',
//         devtool:false,
//         // entry:'./src/index.js'
//         // optimize:[
//         //     env.production?'启动压缩':'不启动压缩'
//         // ],
//         entry:{
//             main:'./src/index.js'
//         },
//         output:{
//             path:path.resolve(__dirname,'dist'), //输出目录
//             filename:'main.js' //输出文件名
//         },
//         module:{
//             rules:[
//                 {
//                     test:/\.txt$/,
//                     use:'raw-loader'//loader就是把webpack不认识的 转换为认识的      
//                 },
//             ]
//         },
//         plugins:[
//             new HtmlWebpackPlugin({
//                 template:'./src/index.html'
//             }),
//             new webpack.DefinePlugin({
//                 //运行的本质是在编译的时候一个纯的字符串替换，并不会定义任何的变量
//                 'process.env.NODE_ENV2':JSON.stringify('development'),
//                 'NODE_ENV2':JSON.stringify('development')
//             })
//         ]
//     }
// }




/**
 * 
 * 怎么样区分环境变量四种方式？
 * 1.--mode
 * 2.--env=production
 * 3.cross-env         window set 中间不能用空格 得用&       mac export
 * 4.DefinePlugin 插件 可以在模块内部替换变量
 */