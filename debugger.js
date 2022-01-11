const webpack = require('./webpack')
const options = require('./webpack.config')
const compiler = webpack(options)
compiler.run((err, stats) => {
    console.log(err);
    console.log(stats.toJson({
        modules:true,
        chunks:true,
        assets: true
    }))
})