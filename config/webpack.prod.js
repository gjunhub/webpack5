const path = require("path");
const eslintPlugin = require("eslint-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
const miniCssExtract = require("mini-css-extract-plugin");
const cssMinimizer = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

const os = require("os");

const threads = os.cpus().length;//获取cpu核数

module.exports = {
    entry: "./src/main.js",//相对路径
    output: {
        //__dirname 当前文件的文件夹目录
        path: path.resolve(__dirname,"../dist"),//绝对路径
        filename: "js/[name].js",
        //图片、字体等通过type：asset处理资源命名方式
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        //自动清空上一次打包内容，webpack5之前都运用 cleanWebpackPlugin去配置
        clean: true,
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
                        //利用 assetModuleFilename 处理了
                        // generator: {
                        //     filename: "static/image/[hash:10][ext][query]"
                        // }
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
            filename: "static/css/[name].css",
            //外部引入的页面js中涵盖了css的话，需要以下处理
            chunkFilename: "static/css/[name].chunk.css"
        }),
        // 样式压缩
        new cssMinimizer(),
        // js压缩 默认webpack5自带-该其配置 此处需体现
        new TerserWebpackPlugin({
            parallel: threads
        }),
        //图片资源过多的时候开启图片压缩
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    "preset-default",
                                    "prefixIds",
                                    {
                                        name: "sortAttrs",
                                        params: {
                                            xmlnsOrder: "alphabetical"
                                        }
                                    }
                                ],
                            },
                        ],
                    ],
                },
            }
        }),
        new PreloadWebpackPlugin({
            rel: "preload",//模式
            as: "script"//优先级， style最高
        })
    ],
    // optimization: {
    //     minimizer: [
    //         //plugins中关于压缩的都可以放这里
    //     ]
    // },
    mode: "production",
    devtool: "source-map"
}