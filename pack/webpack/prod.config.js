module.exports = {
    mode: 'production',
    devServer: {
        proxy: {
            '/gw': {
                target: 'https://wallet.vite.net/',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
