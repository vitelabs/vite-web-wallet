module.exports = {
    devtool: 'source-map',
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        proxy: {
            '/': 'http://localhost:3000'
        }
    }
};
