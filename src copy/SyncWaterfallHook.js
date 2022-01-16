const {SyncWaterfallHook} = require('tapable')



const hook = new SyncWaterfallHook(['name', 'age'])

hook.tap('1', (name, age) => {
    console.log(1, name, age);
    return 'A'
})


hook.tap('2', (name, age) => {
    console.log(2, name, age);
    // return 'B'
})


hook.tap('3', (name, age) => {
    console.log(3, name, age);
    return 'C'
})
hook.call('zhufeng', 26)