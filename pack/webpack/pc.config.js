const path = require('path');
const getEntry = require('./getEntry');
const { srcPath } = require('../config');

const PC_SRC_PATH = path.join(srcPath, '../srcPC');

const { entry, htmlWebpackPlugins } = getEntry({
    index: {
        path: path.join(PC_SRC_PATH, '/index.js'),
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
            wallet: path.join(PC_SRC_PATH, '/wallet'),
            pcPages: path.join(PC_SRC_PATH, '/pages'),
            pcRouter: path.join(PC_SRC_PATH, '/router'),
            pcI18n: path.join(PC_SRC_PATH, '/i18n'),
            pcStore: path.join(PC_SRC_PATH, '/store'),
            pcUtils: path.join(PC_SRC_PATH, '/utils'),
            pcComponents: path.join(PC_SRC_PATH, '/components'),
            pcServices: path.join(PC_SRC_PATH, '/services'),
            pcAssets: path.join(PC_SRC_PATH, '/assets')
        }
    }
};

