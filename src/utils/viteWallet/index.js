import ViteJS from '@vitelabs/vite.js';

import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';
import pledge from './pledge';

process.env.NODE_ENV !== 'production' && console.log(process.env.goViteServer);

let WS_RPC = new ViteJS.WS_RPC({
    url: process.env.goViteServer,
    timeout: 60000
});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Net: new net(),
    Ledger: new ledger(),
    BigNumber: new bignumber(),
    Types: new Types(),
    TestToken: new TestToken($ViteJS._currentProvider),
    Pledge: new pledge()
};