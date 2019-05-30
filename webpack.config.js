require('./buildRoutes.js');

const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const plugins = require('./webpackConf/plugins.js');
const devConfig = require('./webpackConf/dev.config.js');
const testConfig = require('./webpackConf/test.config.js');
const dexTestNetConfig = require('./webpackConf/dexTestNet.config.js');

const SRC_PATH = path.join(__dirname, './src');
const CHARTING_PATH = path.join(__dirname, './charting_library');
const STATIC_PATH = process.env.APP === 'true'
    ? path.join(__dirname, '../../app/walletPages')
    : path.join(__dirname, './dist');
const development = [ 'dev', 'test', 'dexTestNet' ];

console.log(development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production',);

let webpackConfig = {
    mode: development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production',
    entry: { index: path.join(SRC_PATH, '/index.js') },
    output: {
        path: STATIC_PATH,
        filename: '[name].[hash].js'
    },
    plugins,
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                // uglifyOptions: {
                //     compress: {
                //         unused: true,
                //         drop_debugger: true
                //     },
                //     output: { comments: false }
                // },
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                // extractComments: true,
                sourceMap: false
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                oneOf: [
                    // 这条规则应用到 Vue 组件内的 `<template lang="pug">`
                    {
                        resourceQuery: /^\?vue/,
                        use: [{ loader: 'pug-plain-loader', options: { basedir: SRC_PATH } }]
                    },
                    // 这条规则应用到 JavaScript 内的 pug 导入
                    { use: [ 'raw-loader', { loader: 'pug-plain-loader', options: { basedir: SRC_PATH } } ] }
                ]

            },
            {
                test: /\.vue$/,
                use: [{ loader: 'vue-loader' }]
            }, {
                test: /\.(svg|png|jpg|gif)$/,
                loader: 'url-loader',
                query: {
                    // 10KB
                    limit: 10 * 1024
                }
            }, {
                test: /\.js$/,
                exclude: /node_modules(?!(\/base-x)|(\/resize-detector)|(\/vue-echarts))|(\/@vite\/vitejs)/,
                // exclude: /node_modules(?!(\/base-x)|(\/resize-detector)|(\/vue-echarts))/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                        // [TODO] Async Route
                        // plugins: ['syntax-dynamic-import']
                    }
                }
            }, {
                test: /(\.scss$|\.css$|\.sass$)/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                    // { loader: 'postcss-loader' }
                ]
            } ]
    },
    resolve: {
        alias: {
            '@vite/vitejs': '@vite/vitejs/es5/index.js',
            vue: 'vue/dist/vue.js',
            charting: CHARTING_PATH,
            src: SRC_PATH,
            uiKit: path.join(SRC_PATH, '/uiKit'),
            wallet: path.join(SRC_PATH, '/wallet'),
            services: path.join(SRC_PATH, '/services'),
            components: path.join(SRC_PATH, '/components'),
            pages: path.join(SRC_PATH, '/pages'),
            assets: path.join(SRC_PATH, '/assets'),
            router: path.join(SRC_PATH, '/router'),
            utils: path.join(SRC_PATH, '/utils'),
            plugins: path.join(SRC_PATH, '/plugins'),
            i18n: path.join(SRC_PATH, '/i18n'),
            store: path.join(SRC_PATH, '/store'),
            version: path.join(SRC_PATH, '../version.json')
        },
        extensions: [ '.js', '.scss', '.vue', '.json' ]
    }
};

if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
}
if (process.env.NODE_ENV === 'test') {
    webpackConfig = merge(webpackConfig, testConfig);
}
if (process.env.NODE_ENV === 'dexTestNet') {
    webpackConfig = merge(webpackConfig, dexTestNetConfig);
}
if (process.env.NODE_ENV !== 'production') {
    webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;
