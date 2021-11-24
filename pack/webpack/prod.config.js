const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: true,
                terserOptions: {
                    compress: {
                        // collapse_vars: true,
                        // reduce_vars: true,
                        unused: true,
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            })
        ]
    }
};
