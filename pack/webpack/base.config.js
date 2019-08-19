const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { staticPath, srcPath, envVars } = require('../config.js');

const CHARTING_PATH = path.join(__dirname, '../../charting_library');
const Buffer_Path = path.join(__dirname, '../../node_modules/buffer/index.js');

module.exports = {
    output: {
        path: staticPath,
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin(envVars),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function (resource) {
            resource.request = Buffer_Path;
        })
    ],
    optimization: {
        usedExports: true,
        splitChunks: {
            hidePathInfo: true,
            chunks: 'all',
            cacheGroups: {
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
                //         test: /src(?!(\/utils))/,
                //         minChunks: 2,
                //         minSize: 0,
                //         priority: 1
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
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to <template lang="pug"> in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: [{ loader: 'pug-plain-loader', options: { basedir: srcPath } }]
                    },
                    // this applies to pug imports inside JavaScript
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
                    options: { presets: ['@babel/preset-env'] }
                }
            }, {
                test: /(\.scss$|\.css$|\.sass$)/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { minimize: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            parser: 'postcss-scss',
                            plugins: [
                                require('autoprefixer'),
                                require('postcss-pxtorem')({
                                    rootValue: 100,
                                    unitPrecision: 5,
                                    propList: [ '*', '!border*' ]
                                })
                            ]
                        }
                    },
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
            store: path.join(srcPath, '/store')
        },
        extensions: [ '.js', '.ts', '.scss', '.vue', '.json' ],
        modules: [path.resolve(srcPath, '../node_modules')]
    },
    devServer: {
        quiet: false,
        host: '0.0.0.0',
        port: 8081,
        hot: true,
        proxy: {
            '/trade': {
                target: 'http://localhost:8081',
                pathRewrite: { '^/trade\w*': '' }
            },
            '/mobiledex': {
                target: 'http://localhost:8081/mobileDex.html',
                pathRewrite: { '^/mobiledex\w*': '' }
            }
        }
    }
};
