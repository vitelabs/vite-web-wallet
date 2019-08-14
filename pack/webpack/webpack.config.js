const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const baseConfig = require('./base.config.js');
const { chartingPath, staticPath, srcPath, envVars } = require('../config.js');

const Buffer_Path = path.join(__dirname, '../node_modules/buffer/index.js');

const development = [ 'dev', 'test' ];
const mode = development.indexOf(process.env.NODE_ENV) > -1 ? 'development' : 'production';

const webpackConfig = {
    mode,
    output: {
        path: staticPath,
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            // '@vite/vitejs': '@vite/vitejs/es5/index.js',
            vue: 'vue/dist/vue.js',
            charting: chartingPath,
            src: srcPath,
            uiKit: path.join(srcPath, '/uiKit'),
            services: path.join(srcPath, '/services'),
            components: path.join(srcPath, '/components'),
            assets: path.join(srcPath, '/assets'),
            utils: path.join(srcPath, '/utils'),
            plugins: path.join(srcPath, '/plugins'),
            i18n: path.join(srcPath, '/i18n'),
            store: path.join(srcPath, '/store'),
            version: path.join(srcPath, '../version.json')
        }
    },
    plugins: [
        new webpack.DefinePlugin(envVars),
        new webpack.NormalModuleReplacementPlugin(/\/buffer\//, function (resource) {
            resource.request = Buffer_Path;
        })
    ]
};

module.exports = webpackMerge(webpackConfig, baseConfig);
