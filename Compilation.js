const path = require('path').posix 
const baseDir = toUnixPath(process.cwd())
function toUnixPath(filePah) {
    return filePah.replace(/\\/g, '/')
}
class Compilation{
    constructor(options){
        this.options = options
    }
    build(onCompiled){
        // 5. 根据配置中的entry找出入口文件 
        let entry = {}
        /**
         * 兼容entry的值是对象和字符串的情况
         */
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry
        }else{
            entry = this.options.entry
        }
        for(let entryName in entry){
            let entryPath = path.join(baseDir, entry[entryName])
            console.log(entryPath);
        }
    }
}

module.exports = Compilation