const {AsyncSeriesBailHook} = require('tapable')



const hook = new AsyncSeriesBailHook(['name'])


console.time('cost')

hook.tapPromise('1', (name) => {
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1);
            resolve()
        },1000)
    })
   
})
hook.tapPromise('2', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2);
            resolve('B')
        },2000)
    })
    
})
hook.tapPromise('3', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(3);
            resolve()
        },3000)
    })
})

hook.promise('roubaozi').then( () => {
    console.log('done');
    console.timeEnd('cost')
})