const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const merge = require('webpack-merge');
const devConfig = require('./webpackConf/dev.config.js');
const mapConfig = require('./webpackConf/map.config.js');

const SRC_PATH = path.join(__dirname, 'src');

let plugins = [
    new HtmlWebpackPlugin({
        title: 'Vite Wallet',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: path.join(__dirname, 'index.html')
    }),
    new VueLoaderPlugin()
];
(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

let webpackConfig = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        index: path.join(__dirname, 'src/index.js'),
        vendor: ['vue', 'vuex', 'vue-router']
    },
    output: {
        path: path.join(__dirname, './static'),
        filename: '[name].[hash].js'
    },
    plugins,
    optimization: {
        splitChunks:{
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: false
            })
        ]
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: [{
                loader: 'vue-loader'
            }]
        }, {
            test: /\.(svg|png|jpg|gif)$/,
            loader: 'url-loader',
            query: {
                limit: 10 * 1024 //10KB
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /(\.scss$|\.css$|\.sass$)/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            src: SRC_PATH,
            services: path.join(SRC_PATH, '/services'),
            components: path.join(SRC_PATH, '/components'),
            pages: path.join(SRC_PATH, '/pages'),
            assets: path.join(SRC_PATH, '/assets'),
            routes: path.join(SRC_PATH, '/routes'),
            utils: path.join(SRC_PATH, '/utils'),
            i18n: path.join(SRC_PATH, '/i18n'),
            loopTime: path.join(SRC_PATH, '../config/loopTime'),
            version: path.join(SRC_PATH, '../config/version'),
        },
        extensions: ['.js','.scss','.vue','.json']
    }
};

if (process.env.MAP === 'true') {
    webpackConfig = merge(webpackConfig, mapConfig);
}
if (process.env.NODE_ENV === 'development') {
    webpackConfig = merge(webpackConfig, devConfig);
}

module.exports = webpackConfig;
