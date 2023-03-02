const path = require("path");
const eslintPlugin = require("eslint-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/main.js",//相对路径
    output: {
        //__dirname 当前文件的文件夹目录
        path: undefined,
        filename: "js/bundle.js",
        // //自动清空上一次打包内容，webpack5之前都运用 cleanWebpackPlugin去配置
        // clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|bmp|gif|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        //10k内转成base64
                        //优：减少请求数量、弊：内存体积会变大
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: "static/image/[hash:10][ext][query]"
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                //第一种，直接将babel预设配置到webpack.config.js中
                // options: {
                //     presets: ["@babel/preset-env"]
                // }
                //第二种将配置放到webpack.config.js同级的babel.config.js中
            }
        ]
    },
    plugins: [
        new eslintPlugin({
            context: path.resolve(__dirname,"../src")
        }),
        new htmlPlugin({
            // 1.以public/index.html作为模版，在dist包中新建html
            // 2.新建的html，内容结构与以public中一致&&自动引用打包内容
            template: path.resolve(__dirname,"../public/index.html")
        })
    ],
    devServer: {
        host: "localhost",//启动服务器域名
        port: '3001',//服务器端口号
        open: true
    },
    mode: "development"
}