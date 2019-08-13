require('./pack/prePack/buildRoutes.js');

const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const plugins = require('./pack/plugins.js');
const devConfig = require('./pack/dev.config.js');
const testConfig = require('./pack/test.config.js');

const SRC_PATH = path.join(__dirname, './src');
const WEB_SRC_PATH = path.join(__dirname, './srcWeb');
const MOBILE_SRC_PATH = path.join(__dirname, './srcMobile');

const CHARTING_PATH = path.join(__dirname, './charting_library');
const STATIC_PATH = path.join(__dirname, './dist');
const development = [ 'dev', 'test' ];
const mode = development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production';

console.log(`\n ======== process.env.NODE_ENV: ${ process.env.NODE_ENV } ======== \n`);
console.log(`\n ======== webpackConfig.mode: ${ mode } ======== \n`);

let webpackConfig = {
    mode,
    entry: {
        index: path.join(WEB_SRC_PATH, '/index.js'),
        mobileDex: path.join(MOBILE_SRC_PATH, '/index.js')
    },
    output: {
        path: STATIC_PATH,
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
                //     commons: {
                //         name: 'comomns',
                //         test: /src(?!(\/utils))/, // 可自定义拓展规则
                //         minChunks: 2, // 最小共用次数
                //         minSize: 0, // 代码最小多大，进行抽离
                //         priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
                //     },
                default: {
                    name: 'default',
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
            src: SRC_PATH,
            uiKit: path.join(SRC_PATH, '/uiKit'),
            wallet: path.join(WEB_SRC_PATH, '/wallet'),
            services: path.join(SRC_PATH, '/services'),
            components: path.join(SRC_PATH, '/components'),
            pages: path.join(WEB_SRC_PATH, '/pages'),
            assets: path.join(SRC_PATH, '/assets'),
            router: path.join(WEB_SRC_PATH, '/router'),
            utils: path.join(SRC_PATH, '/utils'),
            plugins: path.join(SRC_PATH, '/plugins'),
            i18n: path.join(SRC_PATH, '/i18n'),
            store: path.join(SRC_PATH, '/store'),
            version: path.join(SRC_PATH, '../version.json')
        },
        extensions: [ '.js', '.ts', '.scss', '.vue', '.json' ]
    }
};

if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
}
if (process.env.NODE_ENV === 'test') {
    webpackConfig = merge(webpackConfig, testConfig);
}
if (process.env.NODE_ENV !== 'production') {
    webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;
