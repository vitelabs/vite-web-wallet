// Const path=require('path');
// const SRC_PATH = path.join(__dirname, '../src');

module.exports = {
    // Entry: {
    // index: path.join(SRC_PATH, '/components/confirmClass/test.js')
    // },
    devServer: {
        quiet: false,
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/gw': {
                target: 'http://132.232.60.116:8000',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
