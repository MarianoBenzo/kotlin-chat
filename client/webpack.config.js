const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Plugins = require("./webpack.plugins");

const isProduction = process.env.NODE_ENV === "production";
const devtool = isProduction ? "hidden-source-map" : "source-map";

const entryPoints = {
    "main": ["./src/components/App.tsx"]
};

const optimization = {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "initial",
                enforce: true
            }
        }
    }
};

module.exports = {
    mode: isProduction ? "production" : "development",
    optimization,
    entry: {
        vendor: ["react", "react-dom"],
        ...entryPoints
    },
    output: {
        path: path.resolve(__dirname, "../src/main/resources/public/static"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.bundle.js",
        publicPath: "/static/"
    },
    devtool: devtool,
    resolve: {
        alias: {
            services: path.resolve(__dirname, "src/services"),
            models: path.resolve(__dirname, "src/models"),
            utils: path.resolve(__dirname, "src/utils"),
            components: path.resolve(__dirname, "src/components"),
        },
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },
    plugins: [
        ...Plugins.base,
    ].concat(isProduction ? Plugins.production : Plugins.development),
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: true,
                            sourceMap: true,
                            modules: {
                                exportLocalsConvention: "camelCase",
                                mode: "local",
                                localIdentName: "[name]__[local]___[hash:base64:5]"
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                includePaths: ["node_modules"]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader"
            }
        ]
    }
};
