require('./buildRoutes.js');

const merge = require('webpack-merge');
const devConfig = require('./webpackConf/dev.config.js');
const testConfig = require('./webpackConf/test.config.js');

let webpackConfig = require('./webpackConf/base.config.js');
if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
}
if (process.env.NODE_ENV === 'test') {
    webpackConfig = merge(webpackConfig, testConfig);
}

module.exports = webpackConfig;
