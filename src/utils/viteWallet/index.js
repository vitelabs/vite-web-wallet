import { client } from '@vite/vitejs';
import * as v from '@vite/vitejs';
import provider from '@vite/vitejs-ws';

import net from './net';
import ledger from './ledger';

console.log(v);

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
window.$ViteJS = new client(WS_RPC);

window.viteWallet = {
    Net: new net(),
    Ledger: new ledger()
};

viteWallet && viteWallet.Ledger.getDefaultTokenList();
viteWallet && viteWallet.Ledger.loopHeight();
