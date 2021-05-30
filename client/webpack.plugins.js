const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const base = [
    new CopyWebpackPlugin({
        patterns:[
            { from: "stylesheets", to: "stylesheets" }
        ]
    })
];

const development = [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.join(__dirname, "static")],
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
    base,
    development,
    production
};
