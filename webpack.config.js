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

let webpackConfig = {
    mode: development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production',
    devtool: 'source-map',

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
        // We specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    },
    module: {
        rules: [ {
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
            exclude: /node_modules(?!(\/base-x)|(\/resize-detector)|(\/vue-echarts))/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
            }
        }, {
            test: /(\.scss$|\.css$|\.sass$)/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' },
                { loader: 'sass-loader' },
                { loader: 'postcss-loader' }
            ]
        } ]
        // Postcss: function() {
        // return [px2rem({remUnit: 75})];
        // }
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            charting: CHARTING_PATH,
            src: SRC_PATH,
            services: path.join(SRC_PATH, '/services'),
            components: path.join(SRC_PATH, '/components'),
            pages: path.join(SRC_PATH, '/pages'),
            assets: path.join(SRC_PATH, '/assets'),
            router: path.join(SRC_PATH, '/router'),
            utils: path.join(SRC_PATH, '/utils'),
            plugins: path.join(SRC_PATH, '/plugins'),
            i18n: path.join(SRC_PATH, '/i18n'),
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

module.exports = webpackConfig;
