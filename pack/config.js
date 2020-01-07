const path = require('path');
const packJson = require('../package.json');

const goViteServer = { // http-DNS
    production: '\'wss://api.vitewallet.com/ws\'',
    test: '\'wss://premainnet.vitewallet.com/test/ws\'',
    dev: '\'wss://premainnet.vitewallet.com/test/ws\''
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
    // production: '\'https://mainnet.infura.io/v3/caae2231051e46a1941f422df1fbcc94\'',
    production: '\'https://api.vitewallet.com/eth/v3/caae2231051e46a1941f422df1fbcc94\'',
    test: '\'https://ropsten.infura.io/http\'',
    dev: '\'https://ropsten.infura.io/http\''
};
const ethExplorer = { // http-DNS
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};
const conversionGate = { // http-DNS
    production: '\'https://vite.wallet.net\'',
    test: '\'\'',
    dev: '\'\''
};
const viteConnect = {
    production: '\'wss://biforst.vitewallet.com\'',
    test: '\'wss://biforst.vitewallet.com\'',
    // test: '\'ws://139.155.7.172:5001\'',
    dev: '\'ws://139.155.7.172:5001\''
};
const dnsHostServer = {
    production: '\'https://config.toujinshe.com\'',
    test: '\'\'',
    dev: '\'\''
};
const rewardApiServer = {
    production: '"https://vitex.vite.net"',
    test: '',
    dev: ''
};

const contractAddress = {
    production: '\'0x1b793e49237758dbd8b752afc9eb4b329d5da016\'',
    test: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dev: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\''
};

const Node_Env = process.env.NODE_ENV;


module.exports = {
    srcPath: path.resolve(__dirname, '../src'),
    staticPath: path.join(__dirname, '../dist'),
    mobileStaticPath: path.join(__dirname, '../distH5'),
    appStaticPath: path.join(__dirname, '../distAPP'),
    envVars: {
        'process.env.version': `"${ packJson.version }"`,
        'process.env.NODE_ENV': `"${ Node_Env }"`,
        'process.env.goViteServer': goViteServer[Node_Env],
        'process.env.viteExplorer': viteExplorer[Node_Env],
        'process.env.contractAddress': contractAddress[Node_Env],
        'process.env.ethServer': ethServer[Node_Env],
        'process.env.ethExplorer': ethExplorer[Node_Env],
        'process.env.pushServer': pushServer[Node_Env],
        'process.env.dexApiServer': dexApiServer[Node_Env],
        'process.env.viteConnect': viteConnect[Node_Env],
        'process.env.gatewayInfosServer': gatewayInfosServer[Node_Env],
        'process.env.conversionGate': conversionGate[Node_Env],
        'process.env.dnsHostServer': dnsHostServer[Node_Env],
        'process.env.rewardApiServer': rewardApiServer[Node_Env]
    }
};
