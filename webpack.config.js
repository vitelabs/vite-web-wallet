require('./pack/prePack/index.js');

const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { entry, htmlWebpackPlugins } = require('./pack/webpack/getEntry');
const baseConfig = require('./pack/webpack/base.config.js');
const devConfig = require('./pack/webpack/dev.config.js');
const testConfig = require('./pack/webpack/test.config.js');
const prodConfig = require('./pack/webpack/prod.config.js');

console.log(`\n ======== process.env.NODE_ENV: ${ process.env.NODE_ENV } ======== \n`);

let webpackConfig = merge({
    entry,
    plugins: htmlWebpackPlugins
}, baseConfig);

(process.env.analyzer === 'true') && webpackConfig.plugins.push(new BundleAnalyzerPlugin());

if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
}
if (process.env.NODE_ENV === 'test') {
    webpackConfig = merge(webpackConfig, testConfig);
}
if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, prodConfig);
}

module.exports = webpackConfig;
