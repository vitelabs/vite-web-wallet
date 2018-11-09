const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packJson = require('../package.json');

const SRC_PATH = path.join(__dirname, '../src');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');
const STATIC_PATH = process.env.APP === 'true' ?
    path.join(__dirname, '../../app/walletPages') : 
    path.join(__dirname, '../static');

const goViteServer = {
    production: '\'wss://testnet.vitewallet.com/ws\'',
    test: '\'wss://testnet.vitewallet.com/test/ws\'',
    dev: '\'wss://testnet.vitewallet.com/test/ws\''
};

let plugins = [
    new HtmlWebpackPlugin({
        title: 'Vite Wallet',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: TEMPLATE_PATH
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        'process.env.powDifficulty': '"67108863"',
        'process.env.version': `"${packJson.version}"`,
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
        'process.env.goViteServer': goViteServer[process.env.NODE_ENV || 'dev'],
        'process.env.viteNet': process.env.NODE_ENV === 'production' ? '\'https://testnet.vite.net/\'' : '\'http://132.232.134.168:8080/\''
    })
];
(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

let development = ['dev', 'test'];

module.exports = {
    mode: development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production',
    devtool: 'source-map',

    entry: {
        index: path.join(SRC_PATH, '/index.js')
    },
    output: {
        path: STATIC_PATH,
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
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
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
            config:path.join(SRC_PATH, '../config'),
            mock:path.join(SRC_PATH, '../mock')
        },
        extensions: ['.js', '.scss', '.vue', '.json']
    }
};
