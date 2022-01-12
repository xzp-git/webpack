const {SyncHook} = require('tapable');
const fs = require('fs')
const path = require('path')


const Compilation = require('./Compilation')
/**
 * 代表整个编译对象，负责整个编译的过程，里面会保存所有的编译信息
 * Compiler实例全局唯一
 */
class Compiler{
    constructor(options){
        this.options = options
        //存的是当前Compiler的hook
        this.hooks = {
            run:new SyncHook(),
            done:new SyncHook()
        }
    }
    //4. 执行对象的 run 方法开始执行编译
    run(callback){

        //在执行Compiler的run方法开头触发run这个钩子
        this.hooks.run.call()
        //编译过程...
        // 5. 根据配置中的entry找出入口文件 
        const onCompile = (err, stats, fileDependencies) => {
            //10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
            for (const filename in stats.assets) {
                let filePath = path.join(this.options.output.path, filename)
                fs.writeFileSync(filePath, stats.assets[filename], 'utf8')
            }
            callback(null, {
                toJson: () => stats
            })
            fileDependencies.forEach(fileDependency => {
                fs.watch(fileDependency, () => this.compile(onCompile))
            });
        }
        this.compile(onCompile)
        this.hooks.done.call()
    }

    compile(onCompiled){
        //以后每次开启一次新的编译，都会创建一个新的Compilation类的实例
        let compilation = new Compilation(this.options)
        compilation.build(onCompiled)
    }
    
}

module.exports = Compiler