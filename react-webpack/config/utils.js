const path = require("path");
//output
const getOutput = (isProd) => {
    const basic = {
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true,
    }
    return Object.assign(basic,{
        path: isProd ? path.resolve(__dirname,"../dist") : undefined
    })
}

module.exports = {
    getOutput,
}