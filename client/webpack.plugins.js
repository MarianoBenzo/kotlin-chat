const webpack = require("webpack");
const path = require("path");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const development = [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: path.join(__dirname, "static"),
        cleanAfterEveryBuildPatterns: ["!*"],
        dangerouslyAllowCleanPatternsOutsideProject: true
    })
];

const production = [
    new OptimizeCssAssetsPlugin({}),
    new TerserPlugin(),
    new MiniCssExtractPlugin({
        filename: path.join("build.css")
    })
];

module.exports = {
    development,
    production
};
