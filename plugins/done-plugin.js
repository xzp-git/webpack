class DonePlugin{
    constructor(options){
        this.options = options
    }

    apply(compiler){
        console.log('DonePlugin');
    }
}

module.exports = DonePlugin