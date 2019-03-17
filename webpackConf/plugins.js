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
const conversionHost = {
    production: '\'gateway.vite.net\'',
    test: '\'132.232.60.116:8000\'',
    dev: '\'132.232.60.116:8000\''
};
const ethNet = {
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};
const pushServer={
    test:'"ws://132.232.65.121:11211/websocket"',
    dev:'"wss://192.168.31.190:11211/websocket"'
};

let Node_Env = process.env.NODE_ENV || 'dev';
let ENV = Node_Env === 'testout' ? 'test' : Node_Env;

let plugins = [
    new HtmlWebpackPlugin({
        title: 'Vite Wallet',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: TEMPLATE_PATH
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        'process.env.version': `"${packJson.version}"`,
        'process.env.NODE_ENV': `"${Node_Env}"`,
        'process.env.goViteServer': goViteServer[ENV],
        'process.env.viteNet': viteNet[ENV],
        'process.env.contractAddress': contractAddress[ENV],
        'process.env.ethServer': ethServer[ENV],
        'process.env.conversionHost': conversionHost[ENV],
        'process.env.ethNet': ethNet[ENV],
        'process.env.pushServer':pushServer[ENV]
    }),
    new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function(resource) {
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
        },
    })
];

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = plugins;
