
const babel = require('@babel/core')
/**
 * babel-loader只是一个转换JS源代码的函数
 * @param {*} source 接收一个source参数
 */
function loader(source) {

   let options = this.getOptions({})
   let {code} = babel.transform(source, options)
   return code //转换成es5的内容
}

module.exports = loader


/**
 * babel-loader
 * @babel/core 真正要转换代码es6 到es5需要 靠 @babel/core
 *             本身只能提供从源代码转成语法树，遍历语法树，从新的语法树重新生成源代码的功能
 * babel plugin 但是插件知道如何转换AST语法树
 *              例如转换箭头函数插件  plugin-babel-transform-arrow-functions
 *              但是转化成es5语法的插件有很多中      
 * @babel/preset-env
 *              我们去一个个的配置babel的插件很繁琐， 这就需要用到插件集合了
 *              我们就不需要一个个的去配置插件了，只需要配置这一个插件集合可以了，
 *              
 */