const path = require('path');
const packJson = require('../package.json');

const goViteServer = { // http-DNS
    production: '\'wss://node.vite.net/gvite/ws\'',
    test: '\'wss://node.vite.net/test/gvite/ws\'',
    dev: '\'wss://node.vite.net/test/gvite/ws\''
    // dev: '\'wss://api.vitewallet.com/ws\''
    // dev: '\'ws://148.70.30.139:41423\''
    // dev: '\'ws://111.231.218.73:41423\''
};
const dexApiServer = { // http-DNS
    production: '"https://vitex.vite.net"',
    test: '"https://vitex.vite.net"',
    dev: '"https://vitex.vite.net"'
    // dev: '"http://192.168.31.213:8080"'
};
const pushServer = { // http-DNS
    production: '"wss://vitex.vite.net/websocket"',
    test: '"wss://vitex.vite.net/test/websocket"',
    dev: '"wss://vitex.vite.net/test/websocket"'
};
const gatewayInfosServer = { // http-DNS
    production: '"https://crosschain.vite.net"',
    test: '"https://crosschain-test.vite.net"',
    dev: '"https://crosschain-test.vite.net"'
};
const viteExplorer = { // http-DNS
    production: '\'https://explorer.vite.net\'',
    test: '\'http://132.232.134.168:8080\'',
    dev: '\'http://132.232.134.168:8080\''
};
const ethServer = { // http-DNS
    production: '\'https://node.vite.net/eth/v3/caae2231051e46a1941f422df1fbcc94\'',
    test: '\'https://ropsten.infura.io/http\'',
    dev: '\'https://ropsten.infura.io/http\''
};
const ethExplorer = { // http-DNS
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};
const conversionGate = { // http-DNS
    production: '\'https://gateway.vite.net\'',
    test: '\'\'',
    dev: '\'\''
};
const viteConnect = {
    production: '\'wss://biforst.vite.net\'',
    test: '\'wss://biforst.vite.net\'',
    // test: '\'ws://139.155.7.172:5001\'',
    dev: '\'wss://biforst.vite.net\''
};
const dnsHostServer = {
    production: '[\'https://config.zaokaidian.com\', \'https://config.vitewallet.com\']',
    test: '\'\'',
    dev: '\'\''
};
const rewardApiServer = {
    production: '"https://vitex.vite.net"',
    test: '"https://vitex.vite.net"',
    dev: '"https://vitex.vite.net"'
};

const contractAddress = {
    production: '\'0x1b793e49237758dbd8b752afc9eb4b329d5da016\'',
    test: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dev: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\''
};

const Node_Env = process.env.NODE_ENV;
let API = process.env.API;

if (!API) {
    API = Node_Env;
}

module.exports = {
    srcPath: path.resolve(__dirname, '../src'),
    staticPath: path.join(__dirname, '../dist'),
    mobileStaticPath: path.join(__dirname, '../distH5'),
    appStaticPath: path.join(__dirname, '../distAPP'),
    envVars: {
        'process.env.version': `"${ packJson.version }"`,
        'process.env.NODE_ENV': `"${ Node_Env }"`,
        'process.env.API': `"${ API }"`,
        'process.env.goViteServer': goViteServer[API],
        'process.env.viteExplorer': viteExplorer[API],
        'process.env.contractAddress': contractAddress[API],
        'process.env.ethServer': ethServer[API],
        'process.env.ethExplorer': ethExplorer[API],
        'process.env.pushServer': pushServer[API],
        'process.env.dexApiServer': dexApiServer[API],
        'process.env.viteConnect': viteConnect[API],
        'process.env.gatewayInfosServer': gatewayInfosServer[API],
        'process.env.conversionGate': conversionGate[API],
        'process.env.dnsHostServer': dnsHostServer[API],
        'process.env.rewardApiServer': rewardApiServer[API]
    }
};
