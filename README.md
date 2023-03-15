# 安装webpack等依赖
```
    yarn add webpack webpack-cli -D
```
# npx调用.bin中的环境变量
```
    npx webpack ./src/... --mode=devalopment
```
# 使用style-loader css-loader 编译css文件
```
    yarn add style-loader css-loader -D

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    //后写先执行
                    "style-loader",//将js中css用style-loader转换成<style>放入到html
                    "css-loader" //将css编译成cjs后到js中
                ]
            }
        ]
    }
```
# 使用less-loader 编译.less文件
```
    yarn add less-loader -D

    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    }
```
# webpack5内置file-loader/url-loader
```
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|bmp|gif|svg)$/,
                type: "asset",//注明是需要走小文件转base64
                parser: {
                    dataUrlCondition: {
                        //10k内转成base64
                        //优：减少请求数量、弊：内存体积会变大
                        maxSize: 10 * 1024
                    }
                }
            }
        ]
    }
```
# file自定义文件目录
```
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|bmp|gif|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: "static/image/[hash:10][ext][query]"
                }
            }
        ]
    }
```
# 安装eslint
```
    yarn add eslint eslint-webpack-plugin --save--dev
    //1. 新建 .eslintrc.js配置
    //2. webpack.config.js 添加plugin
    //3. 新建.eslintignore 排除检测dist包中文件
```
# 安装babel
```
    yarn add babel-loader @babel/core @babel/preset-env -D
    1.webpack.config.js
    {
        test: /\.js$/,
        exclude: /node_modules/,//排除该文件夹下文件的检索
        loader: "babel-loader",
        options: {
            //第一种，直接将babel预设配置到webpack.config.js中
            preset: ["@babel/preset-env"]
        }
        //第二种将配置放到webpack.config.js同级的babel.config.js中
    }
    2.使用上述第二种，则创建babel.config.js
```
# 安装html-webpack-plugin
```
    yarn add html-webpack-plugin -D
    // 作为插件引入只webpack.config.js中plugins
    new htmlPlugin({
        // 1.以public/index.html作为模版，在dist包中新建html
        // 2.新建的html，内容结构与以public中一致&&自动引用打包内容
        template: path.resolve(__dirname,"public/index.html")
    })
```
# 安装dev-server服务器
```
    yarn add webpack-dev-server -D
    webpack.config.js
    devServer: {
        host: "localhost",//服务器域名
        port: "3001",//服务器端口号
        open: true// 可以是boolean 也可以是对应的chrome字段
    }
```
# 区分dev/prod环境的webpack文件
```
    1.创建webpack.dev/prod文件
    2.虽创建webpack.env.js在config文件夹中，最后执行还是在最外层，因此webpack.env.js文件中相对路径不需要调整
    path.resolve(__dirname,'src')绝对路径 需要改成../src
    package.json中添加webpack --config ./webpack.dev.js
```
# 单独打包css文件，减少弱网下样式丢失白屏
```
    yarn add mini-css-extract-plugin -D
    1.cssloader => style.loader 最终是将css 抽到style标签植入html，弱网下会造成样式丢失白屏
    2.利用mini-css-extract-plugin 将 css抽到link标签中
```
# 处理css兼容性
```
    yarn add postcss-loader postcss postcss-preset-env -D
    1.config.env.js中module-rules 将 postcss-loader 置于 css-loader 之后 less/sass之前
    2.package.json中添加browsersList 浏览器兼容配置
```
# 处理css压缩
```
    yarn add css-minimizer-webpack-plugin --save--dev
    webpack.prod.js => plugins 中调用
```
# sourceMap报错定位
```
    1.webpack.dev.js
        devtool: "cheap-module-source-map"//开发环境下一行代码量不多，所以这边考虑行映射
    2.webpack.prod.js
        devtool: "source-map"//生产环境下需考虑行、列映射
```
# 模块热替换 HotModuleReplacement
```
    webpack.dev.js
    devServer: {
        hot: true //默认值即 true
    }
    //css文件 开启hot之后 style.loader 会默认应用
    //js文件 默认不支持HMR 例vue种使用 vue-loader来支持，当前板块用module.hot.accept('路径')
```
# oneOf优化module loader加载-一个loader仅被命中一次
```
    oneOf 包裹 module中loader
```
# 开启babel-loader / eslint 缓存后 node_modules中出现.cache文件夹
```
    // babel-loader
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
            cacheDirectory: true,// 开启babel缓存
            cacheCompression: false, //关闭缓存文件压缩
        }
    }
    // eslint
    new eslintPlugin({
        context: path.resolve(__dirname,"../src"),
        cache: true,
        cacheLocation: path.resolve(__dirname,"../node_modules/.cache/eslintcache")
    }),
```
# 利用thread 多进程打包
```
    1.获取cpu核数
    const threads = require("os").cpus().length;
    2.js文件babel
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: "thread-loader",
                options: {
                    works: threads
                }
            },
            {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,// 开启babel缓存
                    cacheCompression: false, //关闭缓存文件压缩
                }
            }
        ]
    }
    3.eslint
    new eslintPlugin({
        context: path.resolve(__dirname,"../src"),
        cache: true,
        cacheLocation: path.resolve(__dirname,"../node_modules/.cache/eslintcache"),
        threads
    }),
    4.js压缩
    const TerserWebpackPlugin = require("terser-webpack-plugin");
    plugins: [
        new TerserWebpackPlugin({
            parallel: threads
        })
    ]
```
# 减少babel编译的体积
```
    babel为编译的每个文件添加了辅助代码，使得代码体积变大
    yarn add @babel/plugin-transfrom-runtime -D
    改plugin禁用了babel自动对每个文件的runtime注入，而是引入，使得所有辅助代码在这里引用
    {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
            plugins: ["@babel/plugin-transform-runtime"],//减少代码体积
        }
    }
```
# 图片资源压缩
```
    yarn add image-minimizer-webpack-plugin imagemin -D 
    // 无损压缩
    yarn add imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
    optimization中minimizer 添加 new ImageMinimizerPlugin
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
```
# codeSplit 适用于 多包项目/多页面引用相同文件
```
    // subProject 文件下 
    1. main.js / index.js 中均引用 add 函数
    2. webpack.config.js
    {
        entry: {
            app: './index.js',
            main: './main.js'
        },
        optimization: {
            splitChunks: {
                chunks: "all",//所有模块进行分割
                minRemainingSize:  0,//类似minSize，最后确保提取的文件大小不能为0
                minChunks: 1,//至少被引用的次数的文件
                cacheGroups: {//哪些模块要打包到一个组
                    defaultVendors: {
                        test: /node_modules/,//模块位置
                        priority: -10, //权重
                        reuseExistingChunk: true, //若当前chunk包含已从主bundle中拆分出的模块，则它将被重用，而不是生成新的模块
                    },
                    default: {
                        //其他没有写的配置会使用上面的默认值
                        minSize: 0, //定义了文件体积大小，大于该值则会会被打包成单独文件
                        minChunks: 2,
                    }
                }
            }
        },
    }
```
# 多入口按需加载/动态加载
```
    1.index.js 利用import懒加载模块，使用该方法会将引用的模块单独打包
    2.仅在触发需要执行的场景时才会http加载模块进来
```
# 按需加载的模块 自定义chunkName
```
    1.subPorject下index.js import 添加 webpackChunkName名称
    2.webpack.config.js output添加 chunkFilename
```
# 统一管理 type：asset命名规则
```
    1.webpack.prod.js
    output{
        ...
        //用来统一代替asset类型中generator.filename定义的模块名
        assetModuleFilename: "static/media/[hash:10][ext][query]"
    }
    2.miniCssExtract
    new miniCssExtract({
        filename: "static/css/[name].css",
        //外部引入的页面js中涵盖了css的话，需要以下处理
        chunkFilename: "static/css/[name].chunk.css"
    }),
```
# Preload/Prefetch加载资源
```
    相同点：
        都会加载资源、不执行
        都会缓存
    区别：
        Preload 加载优先级高
        Preload 只加载当前页面需要使用的资源，Prefetch可以加载当前页面资源，也可以加载下一个页面需要使用的资源
    总结：
        当前页面优先级高的资源使用 Preload 加载
        下一个页面需要使用资源用的 Prefetch 加载
        兼容性很差，Preload略微好些
    yarn add --save--dev @vue/preload-webpack-plugin
    new PreloadWebpackPlugin({
        rel: "preload",//模式
        as: "script"//优先级， style最高
    })
```