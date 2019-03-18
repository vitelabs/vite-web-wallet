// const path=require('path');
// const SRC_PATH = path.join(__dirname, '../src');

module.exports = {
    // entry: {
    //     index: path.join(SRC_PATH, '/components/confirmClass/test.js')
    // },
    devServer: {
        quiet: false,
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/ws': {
                target: 'ws://132.232.65.121:11211',
                ws: true
            },
            '/api': {
                target: 'http://132.232.65.121:8080/test',
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
