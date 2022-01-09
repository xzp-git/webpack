// babel核心模块
const core = require('@babel/core')
// 用来生成或者判断节点的AST语法的节点
const types = require('@babel/types')
let  transformClassesPlugin2 = require("@babel/plugin-transform-classes")
let transformClassesPlugin = {
    visitor:{
        //path代表路径 node代表路径上的节点
        ClassDeclaration(path){
            let node = path.node
            let id = node.id // Identifier name:Person
            let methods = node.body.body //Array<MethodDefinition>
            let nodes = []
            methods.forEach(method =>{
                if (method.kind === 'constructor') {
                    let constructorFunction = types.functionDeclaration(
                        id,
                        method.params,
                        method.body
                    )
                    nodes.push(constructorFunction)
                }else{

                    let memberExpression = types.memberExpression(
                        types.memberExpression(
                            id,
                            types.identifier('prototype')
                        ),
                        method.key
                    ) 
                    let functionExpression = types.functionExpression(
                        method.key,
                        method.params,
                        method.body
                    )
                    let assignmentExpression = types.assignmentExpression(
                        '=',
                        memberExpression,
                        functionExpression
                    )
                    nodes.push(assignmentExpression)
                } 
            })
            if (nodes.length === 1) {
                path.replaceWith(nodes[0])
            }else{
                path.replaceWithMultiple(nodes)
            }
        }
    }
}

// let arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions')
// let arrowFunctionPlugin2 = {
//     visitor:{
//         //如果是箭头函数那么就会进来此函数，参数是箭头函数的节点路径对象
//         ArrowFunctionExpression(path){
//             let node = path.node
//             node.type = `FunctionExpression`
//         }
//     }
// }

// let sourceCode = `
// const sum = (a, b) => {
//     return a + b;
// }
// `
let sourceCode = `
class Person{
    constructor(name){
        this.name = name
    }
    sayName(){
        console.log(this.name)
    }
}
`
let targetSource = core.transform(sourceCode,{
    plugins:[transformClassesPlugin]
})

console.log(targetSource.code); 


/**
 * babel-core 包括三部分
 * 1. 把源代码转成AST语法树
 * 2. 遍历AST语法树 遍历的时候会把语法树给插件进行处理，插件可以关注自己感兴趣的类型，进行处理
 * 3. 新的AST语法树重新生成源代码
 */