module.exports = {
    devServer: {
        quiet: false,
        host: '127.0.0.1',
        port: 8081,
        proxy: {
            '/api': {
                target: 'https://testnet.vite.net',
                changeOrigin: true,
                secure: false
            },
            '/gw': {
                target: 'http://132.232.60.116:8000',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
