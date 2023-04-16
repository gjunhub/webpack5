const common = require("./webpack.common");
const { getOutput } = require("./utils");
const { merge } = require("webpack-merge");

const isProd = process.env.NODE_ENV === "production";

module.exports = merge(common,{
  output: getOutput(isProd)
})