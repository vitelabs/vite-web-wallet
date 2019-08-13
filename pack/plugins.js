const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CircularDependencyPlugin = require('circular-dependency-plugin');

const packJson = require('../package.json');
const SRC_PATH = path.join(__dirname, '../src');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');
const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');

const goViteServer = {
    production: '\'wss://api.vitewallet.com/ws\'',
    test: '\'wss://premainnet.vitewallet.com/test/ws\'',
    dev: '\'wss://premainnet.vitewallet.com/test/ws\''
};
const viteNet = {
    production: '\'https://explorer.vite.net/\'',
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
    test: '\'132.232.60.116:8001\'',
    dev: '\'132.232.60.116:8001\''
};
const ethNet = {
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};
const dexApiServer = {
    production: '"https://vitex.vite.net/api/"',
    test: '"https://vitex.vite.net/test/api/"',
    dev: '"https://vitex.vite.net/test/api/"'
};
const pushServer = {
    production: '"wss://vitex.vite.net/websocket"',
    test: '"wss://vitex.vite.net/test/websocket"',
    dev: '"wss://vitex.vite.net/test/websocket"'
};
const gatewayInfosServer = {
    production: '"crosschain.vite.net"',
    test: '"crosschain-test.vite.net"',
    dev: '"https://crosschain-test.vite.net"'
};
const Node_Env = process.env.NODE_ENV || 'dev';

const plugins = [
    new HtmlWebpackPlugin({
        title: 'ViteX, Exchange By the Community, For the Community',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: TEMPLATE_PATH,
        filename: 'index.html',
        hash: true,
        chunks: [ 'index', 'vendors', 'default' ],
        minify: {
            removeAttributeQuotes: true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }
        // [TODO] Async Router
        // chunksSortMode: 'none'
    }),
    new HtmlWebpackPlugin({
        title: 'ViteX, Exchange By the Community, For the Community',
        favicon: path.join(SRC_PATH, 'assets/imgs/logo.png'),
        template: TEMPLATE_PATH,
        filename: 'mobileDex.html',
        hash: true,
        chunks: [ 'mobileDex', 'vendors', 'default' ],
        minify: {
            removeAttributeQuotes: true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }
        // [TODO] Async Router
        // chunksSortMode: 'none'
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
        'process.env.dexApiServer': dexApiServer[Node_Env],
        'process.env.gatewayInfosServer': gatewayInfosServer[Node_Env]
    }),
    new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function (resource) {
        resource.request = Buffer_Path;
    })
    // new CircularDependencyPlugin({
    //     // exclude detection of files based on a RegExp
    //     exclude: /node_modules/,
    //     // add errors to webpack instead of warnings
    //     failOnError: true,
    //     // set the current working directory for displaying module paths
    //     cwd: process.cwd()
    // })
];

(process.env.analyzer === 'true') && plugins.push(new BundleAnalyzerPlugin());

module.exports = plugins;
