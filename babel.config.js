module.exports = {
    presets: [
        [ "@babel/preset-env",
        {
            "useBuiltIns": "usage",//按需加载自动
            "corejs": {
                "version": "3.8",
                "proposals": true
            }
        }]
    ]
}