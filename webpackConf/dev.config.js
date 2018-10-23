module.exports = {
    devServer: {
        quiet: false,
        host: '127.0.0.1',
        port: 8081,
        proxy: {
            '/api': {
                target: 'https://testnet.vite.net',
                changeOrigin:true,
                secure: false
            }
        }
    }
};
