

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
    args(options = {}){
        let { before, after} = options
        let allArgs = this.options.args
        if(before) allArgs = [before, ...allArgs]
        if(after) allArgs = [...allArgs, after]

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
    }
    callTapsParallel(onDone){
        let taps = this.options.taps

        let code = `var _counter = ${taps.length}\n`
        code += `
        var _done = (function(){
            ${onDone()}
        });`
        for (let i = 0; i < taps.length; i++) {
            let content = this.callTap(i)
            code += content
        }
        return code
    }
    /**
     * 
     * @param {*} i 
     */
    callTap(tapIndex){
        let code = ``
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        let tapInfo = this.options.taps[tapIndex]
        switch (tapInfo.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()})\n`
                break;
            case 'async':
                code += `
                _fn${tapIndex}(${this.args({
                    after:`function(){
                        if(--_counter === 0) _done()
                    }`})});`
                break;
            case 'promise':
                code += `
                var _promise${tapIndex} =  _fn${tapIndex}(${this.args()});
                _promise${tapIndex}.then(function(){
                    if(--_counter === 0) _done()
                })
                `
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
            case 'async':
                fn = new Function(
                    this.args({after:'_callback'}),
                    this.head()+this.content({ onDone: () => `_callback();\n` })
                )
                
                break;  
            case 'promise':

                let tapsContent = this.content({ onDone: () => `_resolve();\n` });
                let content = `
                    return new Promise((function (_resolve) {
                        ${tapsContent}
                    }));
                `;

                fn = new Function(
                    this.args(),
                    this.head()+content
                )
                
                break;        
            default:
                break;
        }
        return fn
    }
}

module.exports = HookCodeFactory