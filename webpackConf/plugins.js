const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const px2rem = require('postcss-px2rem');

const packJson = require('../package.json');
const SRC_PATH = path.join(__dirname, '../src');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');
const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');

const goViteServer = {
    production: '\'wss://testnet.vitewallet.com/ws\'',
    test: '\'wss://testnet.vitewallet.com/test/ws\'',
    dev: '\'wss://testnet.vitewallet.com/test/ws\'',
    dexTestNet: '\'wss://testnet.vitewallet.com/beta/ws\''
};
const viteNet = {
    production: '\'https://testnet.vite.net/\'',
    test: '\'http://132.232.134.168:8080/\'',
    dev: '\'http://132.232.134.168:8080/\'',
    dexTestNet: '\'https://testnet.vite.net/\''
};
const ethServer = {
    production: '\'https:\/\/mainnet.infura.io\/http\'',
    test: '\'https://ropsten.infura.io/http\'',
    dev: '\'https://ropsten.infura.io/http\'',
    dexTestNet: '\'https://ropsten.infura.io/http\''
};
const contractAddress = {
    production: '\'0x1b793e49237758dbd8b752afc9eb4b329d5da016\'',
    test: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dev: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dexTestNet: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\''
};
const conversionHost = {
    production: '\'gateway.vite.net\'',
    test: '\'132.232.60.116:8000\'',
    dev: '\'132.232.60.116:8000\'',
    dexTestNet: '\'132.232.60.116:8000\''
};
const ethNet = {
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\'',
    dexTestNet: '\'https://ropsten.etherscan.io\''
};
const dexApiServer = {
    test: '"https://vitex.vite.net/test/api/"',
    dev: '"https://vitex.vite.net/test/api/"',
    dexTestNet: '"https://vitex.vite.net/beta/api/"'
};
const pushServer = {
    test: '"wss://vitex.vite.net/test/websocket"',
    dev: '"wss://vitex.vite.net/test/websocket"',
    dexTestNet: '"wss://vitex.vite.net/beta/websocket"'
};

const Node_Env = process.env.NODE_ENV || 'dev';

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Vite Wallet',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: TEMPLATE_PATH
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        'process.env.version': `"${ packJson.version }"`,
        'process.env.NODE_ENV': `"${ Node_Env }"`,
        'process.env.goViteServer': goViteServer[Node_Env],
        'process.env.viteNet': viteNet[Node_Env],
        'process.env.contractAddress': contractAddress[Node_Env],
        'process.env.ethServer': ethServer[Node_Env],
        'process.env.conversionHost': conversionHost[Node_Env],
        'process.env.ethNet': ethNet[Node_Env],
        'process.env.pushServer': pushServer[Node_Env],
        'process.env.dexApiServer': dexApiServer[Node_Env]
    }),
    new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function (resource) {
        resource.request = Buffer_Path;
    }),
    new webpack.LoaderOptionsPlugin({
        vue: {
            postcss: [
                px2rem({
                    remUnit: 75,
                    propWhiteList: []
                })
            ]
        }
    })
];

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = plugins;
