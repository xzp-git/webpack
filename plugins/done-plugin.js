class DonePlugin{
    //参数是compiler对应的实例
    apply(compiler){
        compiler.hooks.done.tap('DonePlugin', () => {
            console.log('结束编译');
        })
    }
}

module.exports = DonePlugin