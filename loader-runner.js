const fs = require('fs')

/**
 * 创建loader对象
 * @param {*} loader loadr文件的绝对路径 
 */
function createLoaderObject(loader) {   
    let normal = require(loader)
    let pitch = normal.pitch
    //loader是否需要原生的Buffer类型的数据
    //false webpack会把源文件内容转成字符串传给loader
    //true webpack会把源文件转成Buffer传进来 file-loader url-loader
    let raw = normal.raw || false
    return {
        path: loader,
        normal,
        pitch,
        raw,//
        data:{}, //每一个loader都可以有一个自己的data对象，用来放置自己loader的一些信息
        pitchExecuted:false,//表示当前的loader的pitch函数已经执行过了
        normalExecuted:false//表示当前的loader的normal函数已经执行过了

    }
}
function runLoaders(options, finalCallback) {
    //解构参数 resource要加载的模块 loaders loader数组   loader执行时的this对象 readResource读取文件的方法
    let { resource, loaders = [], context = {}, readResource = fs.readFile } = options
    //转成loader的对象数组
    let loaderObjects = loaders.map(createLoaderObject)
    let loaderContext = context
    loaderContext.resource = resource
    loaderContext.readResource = readResource
    loaderContext.loaders = loaderObjects
    loaderContext.loaderIndex = 0 //当前loader执行的索引
    Object.defineProperty(loaderContext, 'request', {
        get(){
            //loader的路径用感叹号拼在一起 loader1!loader2!loader3!./src/title.js
            return loaderContext.loaders.map(loader => loader.path).concat(loaderContext.resource).join('!')
        }
    })
    //从当前的loader开始剩下的.
    //loader2!loader3!./src/title.js
    Object.defineProperty(loaderContext, 'currentRequest', {
        get(){
            //loader的路径用感叹号拼在一起 loader1!loader2!./src/title.js
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!')
        }
    })
    //从当前loader下一个开始剩下的 loader3!./src/title.js
    Object.defineProperty(loaderContext, 'remainingRequest', {
        get(){
            //loader的路径用感叹号拼在一起 loader1!loader2!./src/title.js
            return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(loader => loader.path).concat(loaderContext.resource).join('!')
        }
    })
    //从当前loader之前的  loader1
    Object.defineProperty(loaderContext, 'previousRequest', {
        get(){
            //loader的路径用感叹号拼在一起 loader1!loader2!./src/title.js
            return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(loader => loader.path).concat(loaderContext.resource).join('!')
        }
    })
    Object.defineProperty(loaderContext, 'data', {
        get(){
            //loader的路径用感叹号拼在一起 loader1!loader2!./src/title.js
            return loaderContext.loaders[loaderContext.loaderIndex].data
        }
    })
    /**
     * 想要二进制的buffer还是字符串
     * @param {*} args 值
     * @param {*} raw 是否想要buffer
     */
    function converArgs(args, raw) {
        if (raw && !Buffer.isBuffer(args[0])) {
            args[0] = Buffer.from(args[0])
        }else if(!raw && Buffer.isBuffer(args[0])){
            args[0] = args[0].toString('utf8')
        }
    }
    /**
     * 迭代执行loader的normal函数
     * @param {*} processOptions 选项
     * @param {*} loaderContext loader执行的上下文
     * @param {*} args 参数
     * @param {*} pitchingCallback pitching回调 
     */

    function iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback) {
        if (loaderContext.loaderIndex < 0) {
            return pitchingCallback(null, ...args)
        }

        let currentLoader = loaderContext.loaders[loaderContext.loaderIndex] //当前索引对应的loader对象
        if (currentLoader.normalExecuted) {
            loaderContext.loaderIndex--
            return iterateNormalLoaders(processOptions, loaderContext, args, pitchingCallback)
        }
        let normalFn = currentLoader.normal
        currentLoader.normalExecuted = true //表示当前的loader的pitch函数已经执行过了
        converArgs(args,currentLoader.raw)

        runSyncOrAsync(normalFn, loaderContext, args, (err, ...returnArgs) => {
            if (err) {
                return pitchingCallback(err)
            }
            return iterateNormalLoaders(normalFn, loaderContext, returnArgs, pitchingCallback)
        })
    }
    /**
     * 以同步或者异步的方式调用fn
     * fn的this指针指向loaderContext
     * 参数args
     * 执行结束后调用runCallback
     * @param {*} fn 
     * @param {*} loaderContext 
     * @param {*} args 
     * @param {*} runCallback 
     */
    function runSyncOrAsync(fn, loaderContext, args, runCallback) {
        //此函数的执行默认是同步的
        let isSync = true
        //动态的添加一个方法 自动执行下一个normalLoader  
        const callback = (...args) => {
            runCallback(...args)
        }
        loaderContext.callback = callback
        loaderContext.async = () => {
            isSync = false //把之前的loader执行从同步变成异步
            return callback
        }
        //用loaderContext作为this 用args作为参数调用fn函数 获取返回值
        let result = fn.apply(loaderContext, args)
        //如果是同步会自动调用向下执行
        if (isSync) {
            callback(null, result)
        }
        //如果是异步什么都不做 等loader中自己来调用callback接着执行下一个normalloader
    }
    /**
     * 读取源文件的内容
     * @param {*} processOptions 参数 
     * @param {*} loaderContext  loader执行的上下文对象
     * @param {*} pitchingCallback 回调
     */
    function processResource(processOptions, loaderContext, pitchingCallback) {
        processOptions.readResource(loaderContext.resource, (err, resourceBuffer)=>{
            if(err) return pitchingCallback(err)
            processOptions.resourceBuffer = resourceBuffer //把读取到的文件的buffer对象传递给processOptions.resourceBuffer
            loaderContext.loaderIndex--//让loaderContext.loaderIndex = 7
            iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], pitchingCallback)
        })
    }
    function  iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
       
        if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
            return processResource(processOptions, loaderContext, pitchingCallback)
        }
       
        let currentLoader = loaderContext.loaders[loaderContext.loaderIndex] //当前索引对应的loader对象
        if (currentLoader.pitchExecuted) {
            loaderContext.loaderIndex++
            return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback)
        }
        let pitchFn = currentLoader.pitch
        currentLoader.pitchExecuted = true //表示当前的loader的pitch函数已经执行过了

        if (!pitchFn) {
            return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback)
        }
        runSyncOrAsync(pitchFn, loaderContext, [
            loaderContext.remainingRequest,
            loaderContext.previousRequest,
            loaderContext.data
        ], (err, returnArgs) => {
            if(returnArgs){
            // if (returnArgs.length > 0 && returnArgs.some(arg => arg)) {
                loaderContext.loaderIndex--;
                iterateNormalLoaders(processOptions, loaderContext, returnArgs, pitchingCallback);
            } else {
                return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback);
            }
        });
    }
    let processOptions = {
        resourceBuffer: null, //当你真正读取源文件的时候会把源文件 Buffer 对象传递过来
        readResource
    }
    iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
        finalCallback(err, {
            result,
            resourceBuffer: processOptions.resourceBuffer
        })
    })
}
exports.runLoaders = runLoaders