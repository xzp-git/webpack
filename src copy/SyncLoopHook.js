const {SyncLoopHook} = require('tapable')



const hook = new SyncLoopHook()

let counter1 = 0, counter2 = 0, counter3 = 0, counter4 = 0

hook.tap('1', () => {
    console.log('counter1', counter1);
    if (++counter1 === 1) {
        counter1 = 0
        return 
    }
    return true
})

hook.tap('2', () => {
    console.log('counter2', counter2);
    if (++counter2 === 2) {
        counter2 = 0
        return 
    }
    return true
})

hook.tap('3', () => {
    console.log('counter3', counter3);
    if (++counter3 === 3) {
        counter3  = 0
        return 
    }
    return true
})

hook.tap('4', () => {
    console.log('counter4', counter4);
    if (++counter4 === 4) {
        counter4  = 0
        return 
    }
    return true
})
hook.call()
