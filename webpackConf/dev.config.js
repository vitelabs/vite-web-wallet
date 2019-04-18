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
            '/gateWay': {
                target: 'http://192.168.31.141:8080',
                pathRewrite: { '^/gateWay': '' }
            }
        }
    }
};
