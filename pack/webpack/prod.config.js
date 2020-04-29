const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     uglifyOptions: {
            //         compress: {
            //             // collapse_vars: true,
            //             // reduce_vars: true,
            //             unused: true,
            //             drop_console: true,
            //             drop_debugger: true
            //         },
            //         output: { comments: false }
            //     },
            //     extractComments: true,
            //     sourceMap: false
            // })
        ]
    }
};
