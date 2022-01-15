const less = require('less')

/**
 * 把less编译成css
 * @param {*} lessSource 
 */
function loader(lessSource) {
    //调用了async方法次loader会变成异步  当前的loader结束后不会自动执行上一个loader
    //而是会等待你调用callback函数才会继续执行
    //如果不调用就会一直卡死在这里
    let callback = this.async()
    less.render(lessSource, {filename: this.resource}, (err, output) => {
        callback(err, output.css)
    })
}

module.exports = loader