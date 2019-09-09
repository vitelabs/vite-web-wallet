require('./pack/prePack/index.js');

const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { mobileStaticPath } = require('./pack/config');
const { entry, htmlWebpackPlugins } = require('./pack/webpack/getEntry');
const baseConfig = require('./pack/webpack/base.config.js');
const devConfig = require('./pack/webpack/dev.config.js');
const testConfig = require('./pack/webpack/test.config.js');
const prodConfig = require('./pack/webpack/prod.config.js');
const pcConfig = require('./pack/webpack/pc.config.js');
const h5Config = require('./pack/webpack/h5.config.js');
const debugConfig = require('./pack/webpack/debug.config.js');

console.log(`\n ======== process.env.NODE_ENV: ${ process.env.NODE_ENV } ======== \n`);

let webpackConfig = merge({
    entry,
    plugins: htmlWebpackPlugins
}, baseConfig);

(process.env.analyzer === 'true') && webpackConfig.plugins.push(new BundleAnalyzerPlugin());

if (process.env.isPC === 'true') {
    webpackConfig = merge(webpackConfig, pcConfig);
} else if (process.env.isH5 === 'true') {
    webpackConfig = merge(webpackConfig, h5Config, {
        output: {
            path: mobileStaticPath,
            filename: '[name].[chunkhash].js'
        }
    });
} else {
    webpackConfig = merge(webpackConfig, pcConfig);
    webpackConfig = merge(webpackConfig, h5Config);
}

if (process.env.NODE_ENV === 'dev') {
    webpackConfig = merge(webpackConfig, devConfig);
    webpackConfig = merge(webpackConfig, debugConfig);
}
if (process.env.NODE_ENV === 'test') {
    webpackConfig = merge(webpackConfig, testConfig);
    webpackConfig = merge(webpackConfig, debugConfig);
}
if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, prodConfig);
}

module.exports = webpackConfig;
