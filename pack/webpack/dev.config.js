const webpack = require('webpack');
const { staticPath } = require('../config.js');

module.exports = {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: staticPath,
        filename: '[name].[hash].js'
    },
    devtool: 'source-map',
    devServer: {
        hot: true,
        proxy: {
            '/gw': {
                target: 'http://132.232.60.116:8001',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
