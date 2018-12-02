import { client, utils } from '@vite/vitejs';
import provider from '@vite/vitejs/dist/es5/provider/WS.js';

import BigNumber from './bignumber';
import pow from './pow';
import net from './net';
import ledger from './ledger';
import pledge from './pledge';

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
WS_RPC.on('connect', () => {
    viteWallet && viteWallet.Ledger.loopHeight();
    viteWallet && viteWallet.Ledger.getDefaultTokenList();
});

window.$ViteJS = new client(WS_RPC);
console.log($ViteJS);

window.viteWallet = {
    encoder: utils.encoder,
    address: utils.address,
    BigNumber,
    getTestToken: (addr) => {
        $ViteJS.request('testapi_getTestToken', addr);
    },
    Net: new net(),
    Pow: new pow(utils),
    Ledger: new ledger(),
    Pledge: new pledge()
};