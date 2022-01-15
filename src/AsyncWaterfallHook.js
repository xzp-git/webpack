const {AsyncSeriesWaterfallHook} = require('tapable')



const hook = new AsyncSeriesWaterfallHook(['name'])


console.time('cost')

hook.tapPromise('1', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1, name);
            resolve('A')
        },1000)
    })
   
})
hook.tapPromise('2', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2, name);
            resolve('B')
        },2000)
    })
    
})
hook.tapPromise('3', (name) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(3, name);
            resolve('C')
        },3000)
    })
})

hook.promise('roubaozi').then( (data) => {
    console.log('done', data);
    console.timeEnd('cost')
})