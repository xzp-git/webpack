const loaderUtils = require("loader-utils")
/**
 * 1.不管什么样的模块最左侧的模块一定要返回一个js模块
 * 创建一个style标签，把css文本就放在style标签里面，然后插入页面
 * @param {*} css 
 */
function loader(css) {
    // let moduleScript = `
    //     let style = document.createElement('style')
    //     style.innerHTML = ${JSON.stringify(css)}
    //     document.head.appendChild(style)
    // `
    // return moduleScript
}
/**
 * 
 * @param {*} remainingRequest 剩下的请求 
 * @param {*} previousRequest 之前的请求
 * @param {*} data 当前的loader的数据对象
 */
loader.pitch = function (remainingRequest) {
    let request = JSON.stringify(
        this.utils.contextify(this.context, remainingRequest)
    )
    let moduleScript = `
        let style = document.createElement('style')
        style.innerHTML = require('!!'+${ request})
        document.head.appendChild(style)
    `

    return moduleScript
}

module.exports = loader

/**
 * urlToRequest 把绝对的路径变为此模块的id
 */