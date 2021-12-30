const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// module.exports = {
//     // mode:'none',
//     mode:'development',
//     devtool:false,
//     // entry:'./src/index.js'
//     entry:{
//         main:'./src/index.js'
//     },
//     output:{
//         path:path.resolve(__dirname,'dist'), //输出目录
//         filename:'main.js' //输出文件名
//     },
//     module:{
//         rules:[
//             {
//                 test:/\.txt$/,
//                 use:'raw-loader'//loader就是把webpack不认识的 转换为认识的      
//             },
//         ]
//     },
//     plugins:[
//         new HtmlWebpackPlugin({
//             template:'./src/index.html'
//         })
//     ]
// }

module.exports = (env, arg) => {

    console.log(env);
    console.log(arg);
    /**
     * { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }
        {
        env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }
        }
     */

    return{
        // mode:'none',
        mode:env.production?'production':'development',
        devtool:false,
        // entry:'./src/index.js'
        // optimize:[
        //     env.production?'启动压缩':'不启动压缩'
        // ],
        entry:{
            main:'./src/index.js'
        },
        output:{
            path:path.resolve(__dirname,'dist'), //输出目录
            filename:'main.js' //输出文件名
        },
        module:{
            rules:[
                {
                    test:/\.txt$/,
                    use:'raw-loader'//loader就是把webpack不认识的 转换为认识的      
                },
            ]
        },
        plugins:[
            new HtmlWebpackPlugin({
                template:'./src/index.html'
            }),
            new webpack.DefinePlugin({
                //运行的本质是在编译的时候一个纯的字符串替换，并不会定义任何的变量
                'process.env.NODE_ENV2':JSON.stringify('development'),
                'NODE_ENV2':JSON.stringify('development')
            })
        ]
    }
}