const HtmlWebpackPlugin = require('html-webpack-plugin');

// const allNameList = [ 'debug', 'mobileDex', 'index' ];

module.exports = function (entryFile) {
    const entry = {};
    const htmlWebpackPlugins = [];

    for (const entryName in entryFile) {
        entry[entryName] = entryFile[entryName].path;
        // const excludeChunks = allNameList.filter(name => name !== entryName);

        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            title: entryFile[entryName].title,
            favicon: entryFile[entryName].favicon,
            template: entryFile[entryName].template,
            filename: `${ entryName }.html`,
            hash: true,
            chunks: [ entryName, 'vendors', 'default' ],
            // excludeChunks,
            minify: {
                removeAttributeQuotes: true,
                removeComments: true,
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }));
    }

    return { entry, htmlWebpackPlugins };
};
