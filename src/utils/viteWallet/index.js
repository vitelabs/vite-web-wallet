import { client } from '@vite/vitejs';
import provider from '@vite/vitejs/dist/es5/provider/WS.js';

import net from './net';
import ledger from './ledger';

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
WS_RPC.on('connect', () => {
    viteWallet && viteWallet.Ledger.loopHeight();
    viteWallet && viteWallet.Ledger.getDefaultTokenList();
});

window.$ViteJS = new client(WS_RPC);
window.viteWallet = {
    Net: new net(),
    Ledger: new ledger()
};
