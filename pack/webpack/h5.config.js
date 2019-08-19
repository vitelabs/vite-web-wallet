const path = require('path');
const getEntry = require('./getEntry');
const { srcPath } = require('../config');

const H5_SRC_PATH = path.resolve(__dirname, '../srcH5');

const { entry, htmlWebpackPlugins } = getEntry({
    mobileDex: {
        path: path.join(H5_SRC_PATH, '/index.js'),
        title: 'ViteX, Exchange By the Community, For the Community',
        favicon: path.join(srcPath, 'assets/imgs/logo.png'),
        template: path.resolve(__dirname, '../index.html')
    }
});

export default {
    entry,
    htmlWebpackPlugins,
    resolve: {
        alias: {
            h5Pages: path.join(H5_SRC_PATH, '/pages'),
            h5Router: path.join(H5_SRC_PATH, '/router'),
            h5Components: path.join(H5_SRC_PATH, '/components'),
            h5Assets: path.join(H5_SRC_PATH, '/assets')
        }
    }
};
