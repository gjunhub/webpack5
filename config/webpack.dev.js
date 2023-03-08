const path = require("path");
const eslintPlugin = require("eslint-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
const miniCssExtract = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const os = require("os");

const threads = os.cpus().length;//获取cpu核数

module.exports = {
    entry: "./src/main.js",//相对路径
    output: {
        //__dirname 当前文件的文件夹目录
        path: undefined,
        filename: "js/bundle.js",
        // //自动清空上一次打包内容，webpack5之前都运用
        // clean: true,
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [
                            miniCssExtract.loader,
                            "css-loader",
                            {
                                loader: "postcss-loader",
                                options: {
                                    postcssOptions: {
                                        plugins: ["postcss-preset-env"],//解决大多数
                                    }
                                } 
                             },
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            miniCssExtract.loader,
                            "css-loader",
                            {
                               loader: "postcss-loader",
                               options: {
                                   postcssOptions: {
                                       plugins: ["postcss-preset-env"],//解决大多数
                                   }
                               } 
                            },
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
                        use: [
                            {
                                //当js文件变多的时候使用多进程有效加快速度
                                loader: "thread-loader",
                                options: {
                                    works: threads
                                }
                            },
                            {
                                loader: "babel-loader",
                                //第一种，直接将babel预设配置到webpack.config.js中
                                // options: {
                                //     presets: ["@babel/preset-env"]
                                // }
                                //第二种将配置放到webpack.config.js同级的babel.config.js中
                                options: {
                                    cacheDirectory: true,// 开启babel缓存
                                    cacheCompression: false, //关闭缓存文件压缩
                                    plugins: ["@babel/plugin-transform-runtime"],//减少代码体积
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    plugins: [
        new eslintPlugin({
            context: path.resolve(__dirname,"../src"),
            cache: true,
            cacheLocation: path.resolve(__dirname,"../node_modules/.cache/eslintcache"),
            threads
        }),
        new htmlPlugin({
            // 1.以public/index.html作为模版，在dist包中新建html
            // 2.新建的html，内容结构与以public中一致&&自动引用打包内容
            template: path.resolve(__dirname,"../public/index.html")
        }),
        // 解决原style-loader 弱网下加载慢闪屏
        new miniCssExtract({
            filename: "static/css/main.css"
        }),
    ],
    devServer: {
        host: "localhost",//启动服务器域名
        port: '3001',//服务器端口号
        open: true,
        hot: true
    },
    mode: "development",
    devtool: "cheap-module-source-map"
}