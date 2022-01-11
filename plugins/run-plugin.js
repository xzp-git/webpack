class RunPlugin{
    //参数是compiler对应的实例
    apply(compiler){
        compiler.hooks.run.tap('RunPlugin', () => {
            console.log('开始编译');
        })
    }
}

module.exports = RunPlugin