import { client } from '@vite/vitejs';
import * as _s from '@vite/vitejs';
import provider from 'WSprovider';

console.log(_s);

import net from './net';
import ledger from './ledger';

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
window.$ViteJS = new client(WS_RPC);

window.viteWallet = {
    Net: new net(),
    Ledger: new ledger()
};

viteWallet && viteWallet.Ledger.getDefaultTokenList();
viteWallet && viteWallet.Ledger.loopHeight();
