const HtmlWebpackPlugin = require('html-webpack-plugin');
const { entryFile } = require('../config');

const entry = {};
const htmlWebpackPlugins = [];

for (const entryName in entryFile) {
    entry[entryName] = entryFile[entryName].path;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        title: entryFile[entryName].title,
        favicon: entryFile[entryName].favicon,
        template: entryFile[entryName].template,
        filename: `${ entryName }.html`,
        hash: true,
        chunks: [ entryName, 'vendors', 'default' ],
        minify: {
            removeAttributeQuotes: true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }
        // [TODO] Async Router
        // chunksSortMode: 'none'
    }));
}

module.exports = { entry, htmlWebpackPlugins };
