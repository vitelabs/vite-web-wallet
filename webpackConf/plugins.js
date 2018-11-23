const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packJson = require('../package.json');
const SRC_PATH = path.join(__dirname, '../src');
const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');

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
        'process.env.powDifficulty': '"157108864"',
        'process.env.version': `"${packJson.version}"`,
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
        'process.env.goViteServer': goViteServer[process.env.NODE_ENV || 'dev'],
        'process.env.viteNet': process.env.NODE_ENV === 'production' ? '\'https://testnet.vite.net/\'' : '\'http://132.232.134.168:8080/\''
    }),
    new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function(resource) {
        resource.request = Buffer_Path;
    })
];

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = plugins;
