const path = require('path');
const getEntry = require('./getEntry');
const { srcPath } = require('../config');

const DEBUG_SRC_PATH = path.join(srcPath, '../srcDebug');

const { entry, htmlWebpackPlugins } = getEntry({
    debug: {
        path: path.join(DEBUG_SRC_PATH, '/index.js'),
        title: 'ViteX, Exchange By the Community, For the Community',
        favicon: path.join(srcPath, 'assets/imgs/logo.png'),
        template: path.join(srcPath, '../index.html')
    }
});

module.exports = {
    entry,
    plugins: htmlWebpackPlugins,
    resolve: {
        alias: {
            debugPages: path.join(DEBUG_SRC_PATH, '/pages'),
            debugRouter: path.join(DEBUG_SRC_PATH, '/router')
        }
    },
    devServer: {
        proxy: {
            '/debug': {
                target: 'http://localhost:8081/debug.html',
                pathRewrite: { '^/debug\w*': '' }
            }
        }
    }
};
