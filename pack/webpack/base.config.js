const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const plugins = require('./plugins.js');
const { staticPath, srcPath, WEB_SRC_PATH, MOBILE_SRC_PATH } = require('../config.js');

const CHARTING_PATH = path.join(__dirname, '../../charting_library');


module.exports = {
    output: {
        path: staticPath,
        filename: '[name].[chunkhash].js'
    },
    plugins,
    optimization: {
        usedExports: true,
        splitChunks: {
            hidePathInfo: true,
            chunks: 'all',
            cacheGroups: {
                // [TODO] Async Router
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                default: {
                    name: 'default',
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
                //     commons: {
                //         name: 'comomns',
                //         test: /src(?!(\/utils))/, // 可自定义拓展规则
                //         minChunks: 2, // 最小共用次数
                //         minSize: 0, // 代码最小多大，进行抽离
                //         priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
                //     },
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: {
                        // collapse_vars: true,
                        // reduce_vars: true,
                        unused: true,
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: { comments: false }
                },
                extractComments: true,
                sourceMap: false
            })
        ]
    },
    module: {
        rules: [
            // [TODO] srcPath
            {
                test: /\.pug$/,
                oneOf: [
                    // 这条规则应用到 Vue 组件内的 `<template lang="pug">`
                    {
                        resourceQuery: /^\?vue/,
                        use: [{ loader: 'pug-plain-loader', options: { basedir: srcPath } }]
                    },
                    // 这条规则应用到 JavaScript 内的 pug 导入
                    { use: [ 'raw-loader', { loader: 'pug-plain-loader', options: { basedir: srcPath } } ] }
                ]

            },
            {
                test: /\.vue$/,
                use: [{ loader: 'vue-loader' }]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                loader: 'url-loader',
                query: {
                    // 10KB
                    limit: 10 * 1024
                }
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                loader: 'image-webpack-loader',
                enforce: 'pre'
            },
            {
                test: /\.(j|t)s$/,
                // exclude: /node_modules(?!(\/base-x)|(\/resize-detector)|(\/vue-echarts))|(\/@vite\/vitejs\/)/,
                exclude: /node_modules(?!(\/base-x)|(\/resize-detector)|(\/vue-echarts))/,
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
                    { loader: 'css-loader', options: { minimize: true } },
                    { loader: 'sass-loader' }
                ]
            }, {
                test: /(\.ttf$|\.ttc$|\.otf$)/,
                use: {
                    loader: 'url-loader',
                    options: { limit: 10000 }
                }
            } ]
    },
    resolve: {
        alias: {
            // '@vite/vitejs': '@vite/vitejs/es5/index.js',
            vue: 'vue/dist/vue.js',
            charting: CHARTING_PATH,
            src: srcPath,
            uiKit: path.join(srcPath, '/uiKit'),
            services: path.join(srcPath, '/services'),
            components: path.join(srcPath, '/components'),
            assets: path.join(srcPath, '/assets'),
            utils: path.join(srcPath, '/utils'),
            plugins: path.join(srcPath, '/plugins'),
            i18n: path.join(srcPath, '/i18n'),
            store: path.join(srcPath, '/store'),
            version: path.join(srcPath, '../version.json'),

            wallet: path.join(WEB_SRC_PATH, '/wallet'),
            webPages: path.join(WEB_SRC_PATH, '/pages'),
            webRouter: path.join(WEB_SRC_PATH, '/router'),
            mobilePages: path.join(MOBILE_SRC_PATH, '/pages')
        },
        extensions: [ '.js', '.ts', '.scss', '.vue', '.json' ]
    }
};
