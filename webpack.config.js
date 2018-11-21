require('./buildRoutes.js');

const merge = require('webpack-merge');
const devConfig = require('./webpackConf/dev.config.js');

let webpackConfig = require('./webpackConf/base.config.js');
if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
}

module.exports = webpackConfig;
