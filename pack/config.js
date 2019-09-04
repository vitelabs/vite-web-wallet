const path = require('path');
const packJson = require('../package.json');

const goViteServer = {
    production: '\'wss://api.vitewallet.com/ws\'',
    test: '\'wss://premainnet.vitewallet.com/test/ws\'',
    dev: '\'wss://premainnet.vitewallet.com/test/ws\''
};
const viteNet = {
    production: '\'https://explorer.vite.net/\'',
    test: '\'http://132.232.134.168:8080/\'',
    dev: '\'http://132.232.134.168:8080/\''
};
const ethServer = {
    production: '\'https:\/\/mainnet.infura.io\/http\'',
    test: '\'https://ropsten.infura.io/http\'',
    dev: '\'https://ropsten.infura.io/http\''
};
const contractAddress = {
    production: '\'0x1b793e49237758dbd8b752afc9eb4b329d5da016\'',
    test: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\'',
    dev: '\'0x54b716345c14ba851f1b51dcc1491abee6ba8f44\''
};
const conversionHost = {
    production: '\'https://gateway.vite.net\'',
    test: '\'http://132.232.60.116:8001\'',
    dev: '\'http://132.232.60.116:8001\''
};
const ethNet = {
    production: '\'https://etherscan.io\'',
    test: '\'https://ropsten.etherscan.io\'',
    dev: '\'https://ropsten.etherscan.io\''
};
const dexApiServer = {
    production: '"https://vitex.vite.net/api/"',
    test: '"https://vitex.vite.net/test/api/"',
    dev: '"https://vitex.vite.net/test/api/"'
};
const pushServer = {
    production: '"wss://vitex.vite.net/websocket"',
    test: '"wss://vitex.vite.net/test/websocket"',
    dev: '"wss://vitex.vite.net/test/websocket"'
};
const gatewayInfosServer = {
    production: '"crosschain.vite.net"',
    test: '"crosschain-test.vite.net"',
    dev: '"https://crosschain-test.vite.net"'
};
const Node_Env = process.env.NODE_ENV || 'dev';


module.exports = {
    srcPath: path.resolve(__dirname, '../src'),
    staticPath: path.join(__dirname, '../dist'),
    mobileStaticPath: path.join(__dirname, '../distH5'),
    envVars: {
        'process.env.version': `"${ packJson.version }"`,
        'process.env.NODE_ENV': `"${ Node_Env }"`,
        'process.env.goViteServer': goViteServer[Node_Env],
        'process.env.viteNet': viteNet[Node_Env],
        'process.env.contractAddress': contractAddress[Node_Env],
        'process.env.ethServer': ethServer[Node_Env],
        'process.env.conversionHost': conversionHost[Node_Env],
        'process.env.ethNet': ethNet[Node_Env],
        'process.env.pushServer': pushServer[Node_Env],
        'process.env.dexApiServer': dexApiServer[Node_Env],
        'process.env.gatewayInfosServer': gatewayInfosServer[Node_Env]
    }
};
