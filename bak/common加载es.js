var module = {
    './src/title.js': (module, exports, require) => {

        //一旦webpack检测到你的代码里有export 和import关键字 他就认为 这是一个ES Module
        require.r(exports)
        require.d(exports, {
            default: () => DEFAULT_EXPORT,
            age: () => age
        })

        const DEFAULT_EXPORT = ('title');
        const age = 24
    }
}

var cache = {};
function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
        return cachedModule.exports;
    }
    var module = cache[moduleId] = {
        exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
}

require.r = (exports) => {
    //表示这个exports是一个ES模块的导出对象 [object Module]
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    //因为webpack最后都是转化为commonJs模块 所以要做个标识 后续知道是esmodule
    Object.defineProperty(exports, '__esModule', { value: true })


}

require.d = (exports, definition) => {
    for (const key in definition) {
        Object.defineProperty(exports, key, { get: definition[key] })
    }
}
const title = require("./src/title.js")
console.log(title);
console.log(title.age);