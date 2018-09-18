module.exports = {
    devtool: 'source-map',
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        proxy: {
            '/testToken': 'https://testnet.vite.net/api/account/newtesttoken'
        }
    }
};
