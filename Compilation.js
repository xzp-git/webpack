const path = require('path').posix 
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const types = require('@babel/types')

const baseDir = toUnixPath(process.cwd())
function toUnixPath(filePah) {
    return filePah.replace(/\\/g, '/')
}
class Compilation{
    constructor(options){
        this.options = options
        this.modules = [] //存放本次编译的所有模块
        this.fileDependencies = []
        this.chunks = []
        this.assets = {}
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
            this.fileDependencies.push(entryPath)
            //6. 从入口文件出发,调用所有配置的Loader对模块进行编译
            let entryModule = this.buildModule(entryName, entryPath)
            console.log(entryModule);
            // 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
            let chunk = {
                name:entryName, //代码块名称 是入口名称
                entryModule, //这个入口代码块中包含哪些模块
                modules: this.modules.filter(module => module.names.includes(entryName))
            }
            this.chunks.push(chunk)
            //9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
            this.chunks.forEach(chunk => {
                let filename = this.options.output.filename.replace('[name]',chunk.name)
                this.assets[filename] = getsource(chunk)
            })
        }
        onCompiled(null, {nodule: this.modules, chunks:this.chunks,  assets:this.assets}, this.fileDependencies)
    }
    buildModule(name, modulePath){
        //6. 从入口文件出发,调用所有配置的Loader对模块进行编译
        let sourceCode = fs.readFileSync(modulePath, 'utf8')
        //匹配此模块需要使用的loader
        let {rules} = this.options.module
        let loaders = []
        rules.forEach(rule => {
            if (modulePath.match(rule.test)) {
                loaders.push(...rule.use)
            }
        })
        sourceCode = loaders.reduceRight((sourceCode, loader) => {
            return require(loader)(sourceCode)
        },sourceCode)
        //7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        
        let moduleId = './' + path.relative(baseDir, modulePath)
        //模块ID就是相对于项目根目录的相对路径
        //names表示此模块被几个模块依赖 [entry1, entry2]
        let module = {id:moduleId, dependencies:[], names:[name]}
        let ast = parser.parse(sourceCode, {sourceType:'module'})
        
        traverse(ast, {
            CallExpression : ({node}) => {
                if (node.callee.name === 'require') {
                    let depModuleName = node.arguments[0].value //'./title'
                    let dirname = path.dirname(modulePath)
                    //依赖的模块的绝对路径
                    let depModulePath = path.join(dirname, depModuleName)       
                    //获取支持的扩展名    
                    let extensions = this.options.resolve.extensions
                    //获取依赖的模块的绝对路径+扩展名
                    depModulePath = tryExtensions(depModulePath, extensions)
                    //把此依赖文件添加到依赖数组里，当文件发生变化了，会重新自动编译，创建一个新的Compilation
                    this.fileDependencies.push(depModulePath)
                    let depModuleId = './' + path.relative(baseDir, depModulePath) 
                    //修改AST语法树 把require方法的参数变成依赖的模块ID
                    node.arguments = [types.stringLiteral(depModuleId)]
                    //把依赖信息添加到依赖数组里    
                    module.dependencies.push({depModuleId, depModulePath})
                }
            }
        })
        let {code} = generator(ast)
        module._source = code
        module.dependencies.forEach(({depModuleId, depModulePath}) => {
            let buildModule = this.modules.find(module => module.id ===depModuleId)
            if (buildModule) {
                buildModule.names.push(name)
            }else{
                let depModule = this.buildModule(name,depModulePath)
                this.modules.push(depModule)
            }
        })
        return module
    }
}

function tryExtensions(modulePath, extensions) {
    if (fs.existsSync(modulePath)) {
        return modulePath
    }
    for (let i = 0; i < extensions.length; i++) {
        let filePah = modulePath + extensions[i]
        if (fs.existsSync(filePath)) {
            return filePah
        }
        
    }
    throw new Error(`${modulePath} not found`)
}

function getsource(chunk) {
    return `
   (() => {
    var modules = {
      ${chunk.modules.map(
        (module) => `
        "${module.id}": (module) => {
          ${module._source}
        },
      `
      )}  
    };
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    var exports ={};
    ${chunk.entryModule._source}
  })();
   `;
}

module.exports = Compilation