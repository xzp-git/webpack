const Jszip = require('jszip')
class ArchivePlugin{
    constructor(options){
        this.ontions = options
    }
    apply(compiler){
        /**
         * 
         * emit当webpack确定好输出的内容后会触发一次  
         */
        compiler.hooks.emit.tap('ArchivePlugin', (compilation) => {
            compilation.hooks.processAssets.tapPromise('ArchivePlugin', (assets) => {
                let zip = new Jszip()
                for (const filename in assets) {
                    const source = assets[filename].source()
                    zip.file(filename, source)
                }
                return zip.generateAsync({type:'nodebuffer'}).then(content => {
                    //向输出的文件列表中添加一个新的文件 key
                    assets['Archive'+Date.now()+'.zip'] = {
                        source(){
                            return content
                        }
                    }
                })
            })
        })
    }
}
module.exports = ArchivePlugin