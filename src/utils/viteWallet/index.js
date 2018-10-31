import ViteJS from '@vitelabs/vite.js';

import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';
import pledge from './pledge';

process.env.NODE_ENV !== 'production' && console.log(process.env.goViteServer);

let WS_RPC = new ViteJS.WS_RPC({
    // url: process.env.goViteServer,
    timeout: 60000
});
WS_RPC.on('connect', (m) => {
    console.log('connect', m);
});
WS_RPC.on('error', (m) => {
    console.log('error', m);
});
WS_RPC.on('close', (m) => {
    console.log('close', m);
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