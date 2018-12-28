import { client } from '@vite/vitejs';
import provider from 'WSprovider';

import net from './net';
import ledger from './ledger';

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
window.$ViteJS = new client(WS_RPC, () => {
    viteWallet && viteWallet.Ledger.getDefaultTokenList();
    viteWallet && viteWallet.Ledger.loopHeight();
});

window.viteWallet = {
    Net: new net(),
    Ledger: new ledger()
};
