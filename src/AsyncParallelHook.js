const {AsyncParallelHook} = require('tapable')



const hook = new AsyncParallelHook(['name'])
// console.time('cost')

// hook.tapAsync('1', (name, callback) => {
//     setTimeout(() => {
//         console.log(1);
//         callback()
//     },1000)
// })
// hook.tapAsync('2', (name, callback) => {
//     setTimeout(() => {
//         console.log(2);
//         callback()
//     },2000)
// })
// hook.tapAsync('3', (name, callback) => {
//     setTimeout(() => {
//         console.log(3);
//         callback()
//     },3000)
// })

// hook.callAsync('roubaozi', (err) => {
//     console.log(err);
//     console.timeEnd('cost')
// })

console.time('cost')

hook.tapPromise('1', (name) => {
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1);
            resolve(name)
        },1000)
    })
   
})
hook.tapPromise('2', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2);
            resolve(name)
        },2000)
    })
    
})
hook.tapPromise('3', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(3);
            resolve(name)
        },3000)
    })
})

hook.promise('roubaozi').then( (err) => {
    console.log(err);
    console.timeEnd('cost')
})