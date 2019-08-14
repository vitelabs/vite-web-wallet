module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        proxy: {
            '/gw': {
                target: 'http://132.232.60.116:8000',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
