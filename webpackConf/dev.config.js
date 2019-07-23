module.exports = {
    devServer: {
        quiet: false,
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/gw': {
                target: 'http://132.232.60.116:8000',
                changeOrigin: true,
                secure: false
            },
            '/trade': {
                target: 'http://localhost:8081',
                pathRewrite: { '^/trade\w*': '' }
            },
            '/gateway': {
                target: 'https://gateway.vitewallet.com/test/crosschain/',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/gateway': '' }
            }
            // '/api/v1': {
            //     target: 'http://192.168.31.189:8082/dev/',
            //     changeOrigin: true,
            //     secure: false
            // }
        }
    }
};
