const Compiler = require('./Compiler')
const { plugins } = require('./webpack.config')


function webpack(options) {
    //1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
    let argv = process.argv.slice(2)
    const shellOptins = argv.reduce((shellOptins,option) =>{
        let [key,value] = option.split('=')
        shellOptins[key.slice(2)] = value
        return shellOptins
    },{})
    const finalOptions = {...options, ...shellOptins}
    // 2. 用上一步得到的参数初始化 Compiler 对象
    let compiler = new Compiler(finalOptions)
    //3. 加载所有配置的插件
    finalOptions.plugins.forEach(plugin => {
        plugin.apply(compiler)
    });
    return compiler
}  

module.exports = webpack