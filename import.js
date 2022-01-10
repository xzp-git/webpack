
// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法的节点
const types = require('@babel/types')

const visitor = {
    ImportDeclaration(path, state){
        const { node } = path //获取节点
        const { specifiers } = node //获取节点
        const { libraryName, libraryDirectory} = state.opts //获取选项中的支持的库的名称
        //如果当前的节点的模块名称使我们需要的库的名称
        if (node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])) {
            //循环需要替换处理的节点
           const declarations =   specifiers.map(specifier => {
                //返回一个importDeclaration
                return types.importDeclaration(
                    [types.importDefaultSpecifier(specifier.local)],
                    types.stringLiteral(`${libraryName}/${libraryDirectory?libraryDirectory:''}${specifier.imported.name}`)
                )
            });
            path.replaceWithMultiple(declarations)
        }
    }
}

module.exports = function () {
    return {
        visitor
    }
}