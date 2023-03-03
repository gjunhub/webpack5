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