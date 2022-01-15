

class HookCodeFactory{
    setup(hook, options){
        hook._x = options.taps.map(tap => tap.fn)
    }
    init(options){
        this.options = options
    }
    deInit(){
        this.options = null
    }
    args(){
        let allArgs = this.options.args
        return allArgs.join(',')
    }
    head(){
        let code = ``
        code += `var _x = this._x;\n`
        return code
    }
    callTapsSeries(){
        let taps = this.options.taps
        if (taps.length === 0) {
            return ''
        }
        let code = ``
        for (let i = 0; i < taps.length; i++) {
            let content = this.callTap(i)
            code += content
        }
        return code
    }/**
     * 
     * @param {*} i 
     */
    callTap(tapIndex){
        let code = ``
        code += `var _fn${tapIndex} = _x[${tapIndex}]\n`
        let tapInfo = this.options.taps[tapIndex]
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()})\n`
                break;
        
            default:
                break;
        }
        return code
    }
    /**
     * 动态创建函数
     * @param {*} options
     * taps tapInfo 数组
     * args参数数组
     * type 注册类型 
     */
    create(options){
        this.init(options)
        let {type} = options
        let fn
        switch (type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.head()+this.content()
                )
                
                break;
        
            default:
                break;
        }
        return fn
    }
}

module.exports = HookCodeFactory