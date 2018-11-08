import ViteJS from '@vite/vitejs';

import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';
import pledge from './pledge';

process.env.NODE_ENV !== 'production' && console.log(process.env.goViteServer);

let reconnectTimes = 0;
let WS_RPC = new ViteJS.WS_RPC({
    url: process.env.goViteServer,
    timeout: 60000
});
WS_RPC.on('connect', () => {
    reconnectTimes = 0;
    viteWallet && viteWallet.Ledger.loopHeight();
    viteWallet && viteWallet.Ledger.getDefaultTokenList();
});
WS_RPC.on('close', () => {
    if (reconnectTimes > 5) {
        return;
    }
    setTimeout(() => {
        reconnectTimes++;
        WS_RPC.reconnect();
    }, 5000);
});

window.$ViteJS = new ViteJS(WS_RPC);
window.viteWallet = {
    Net: new net(),
    Ledger: new ledger(),
    BigNumber: new bignumber(),
    Types: new Types(),
    TestToken: new TestToken($ViteJS._currentProvider),
    Pledge: new pledge()
};