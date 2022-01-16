
const CALL_DELEGATE = function(...args) {
    this.call = this._createCall('sync')
    return this.call(...args)
}

const CALL_ASYNC_DELEGATE = function(...args) {
    this.callAsync = this._createCall('async')
    return this.callAsync(...args)
}
const PROMISE_DELEGATE = function(...args) {
    this.promise = this._createCall('promise')
    return this.promise(...args)
}


class Hook{
    constructor(args){
        //事件回调参数的函数列表数组
        this.args = args
        //放置所有的事件函数对象 [{type:'sync', fn, name:'1'}]
        this.taps = []
        this._x = null //[fn]
        this.call = CALL_DELEGATE
        this.callAsync = CALL_ASYNC_DELEGATE
        this.promise = PROMISE_DELEGATE

    }
    tap(options, fn){
        this._tap('sync', options, fn)
    }
    tapAsync(options, fn){
        this._tap('async', options, fn)
    }
    tapPromise(options, fn){
        this._tap('promise', options, fn)
    }
    _tap(type, options, fn){
        if (typeof options === 'string') {
            options = {
                name:options
            }
        }
        let tapInfo = {...options, type, fn}
        this._insert(tapInfo)
    }
    _insert(tapInfo){
        this.taps.push(tapInfo)
    }
    compile(){
        throw new Error('抽象方法，必须由子类去实现')
    }
    _createCall(type){
        return this.compile({
            taps:this.taps, //事件函数
            args:this.args,//参数数组
            type //类型
        })
    }
}

module.exports = Hook