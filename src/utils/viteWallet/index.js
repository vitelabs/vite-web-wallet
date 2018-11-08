import ViteJS from '@vitelabs/vite.js';

import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';
import pledge from './pledge';
import pow from './pow';

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
    if (reconnectTimes > 10) {
        return;
    }
    setTimeout(() => {
        reconnectTimes++;
        WS_RPC.reconnect();
    }, 10000);
});

window.$ViteJS = new ViteJS(WS_RPC);
window.viteWallet = {
    Vite: $ViteJS.Vite,
    Net: new net(),
    Ledger: new ledger(),
    Pow: new pow($ViteJS._currentProvider, ViteJS.utils),
    BigNumber: new bignumber(),
    Types: new Types(),
    TestToken: new TestToken($ViteJS._currentProvider),
    Pledge: new pledge()
};