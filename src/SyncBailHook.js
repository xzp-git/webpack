const {SyncBailHook} = require('tapable')

/**
 * 当事件回调函数的返回值非undefined的时候 就会停止后续事件函数执行
 */

const hook = new SyncBailHook(['name', 'age'])

hook.tap('1', (name, age) => {
    console.log(1, name, age);
    //不关心返回值
    return undefined
})


hook.tap('2', (name, age) => {
    console.log(2, name, age);
    //不关心返回值
    return 1 
})


hook.tap('3', (name, age) => {
    console.log(3, name, age);
    //不关心返回值
    return 1
})
hook.call('zhufeng', 26)