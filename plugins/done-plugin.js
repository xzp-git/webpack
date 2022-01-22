class DonePlugin{
    constructor(options){
        this.options = options
    }

    apply(compiler){
        //在编译 完成后在打印
        compiler.hooks.done.tap('DonePlugin', (stats, callback) => {
            setTimeout(() => {
              console.log('DonePlugin');
              callback
            }, 0);
        })
    }
}

module.exports = DonePlugin