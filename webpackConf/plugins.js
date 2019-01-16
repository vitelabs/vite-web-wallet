const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packJson = require('../package.json');
const SRC_PATH = path.join(__dirname, '../src');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');
const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');

const goViteServer = {
    production: '\'wss://testnet.vitewallet.com/ws\'',
    test: '\'wss://testnet.vitewallet.com/test/ws\'',
    dev: '\'wss://testnet.vitewallet.com/test/ws\''
};
const viteNet = {
    production: '\'https://testnet.vite.net/\'',
    test: '\'http://132.232.134.168:8080/\'',
    dev: '\'http://132.232.134.168:8080/\''
};
const ethServer = {
    production: '\'https:\/\/mainnet.infura.io\/http\'',
    test: '\'https://ropsten.infura.io/http\'',
    dev: '\'https://ropsten.infura.io/http\''
};
const contractAddress = {
    production: '\'0x1b793e49237758dbd8b752afc9eb4b329d5da016\'',
    test: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dev: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\''
};
const conversionServer = {
    production: '\'https://gateway.vite.net\'',
    test: '\'http://132.232.60.116:8000\'',
    dev: '\'http://132.232.60.116:8000\''
};
const ethNet = {
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};

let ENV = process.env.NODE_ENV || 'dev';

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
        'process.env.NODE_ENV': `"${ENV}"`,
        'process.env.goViteServer': goViteServer[ENV],
        'process.env.viteNet': viteNet[ENV],
        'process.env.contractAddress': contractAddress[ENV],
        'process.env.ethServer': ethServer[ENV],
        'process.env.conversionServer': conversionServer[ENV],
        'process.env.ethNet': ethNet[ENV]
    }),
    new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function(resource) {
        resource.request = Buffer_Path;
    })
];

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = plugins;
