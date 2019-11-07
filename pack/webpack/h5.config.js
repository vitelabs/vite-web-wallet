const path = require('path');
const getEntry = require('./getEntry');
const { srcPath } = require('../config');

const H5_SRC_PATH = path.join(srcPath, '../srcH5');

const { entry, htmlWebpackPlugins } = getEntry({
    mobileDex: {
        path: path.join(H5_SRC_PATH, '/index.js'),
        title: 'ViteX',
        favicon: path.join(srcPath, 'assets/imgs/logo.png'),
        template: path.join(srcPath, '../index.html')
    }
});

module.exports = {
    entry,
    plugins: htmlWebpackPlugins,
    resolve: {
        alias: {
            h5Pages: path.join(H5_SRC_PATH, '/pages'),
            h5Router: path.join(H5_SRC_PATH, '/router'),
            h5Components: path.join(H5_SRC_PATH, '/components'),
            h5Assets: path.join(H5_SRC_PATH, '/assets'),
            h5Store: path.join(H5_SRC_PATH, '/store'),
            h5Services: path.join(H5_SRC_PATH, '/services'),
            h5Utils: path.join(H5_SRC_PATH, '/utils'),
            h5I18n: path.join(H5_SRC_PATH, '/i18n')
        }
    },
    optimization: {
        splitChunks: {
            maxSize: 1024000,
            minSize: 400000
        }
    }
};
