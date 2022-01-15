const less = require('less')

/**
 * 当前这种写法返回的是css脚本 并不是js 所以不能直接单独给webpack使用
 * 把less编译成css
 * @param {*} lessSource 
 */
function loader(lessSource) {
    //调用了async方法次loader会变成异步  当前的loader结束后不会自动执行上一个loader
    //而是会等待你调用callback函数才会继续执行
    //如果不调用就会一直卡死在这里
    let callback = this.async()
    less.render(lessSource, {filename: this.resource}, (err, output) => {
       let script = `module.exports = ${JSON.stringify(output.css)}`
        callback(err, script)
    })
}

module.exports = loader