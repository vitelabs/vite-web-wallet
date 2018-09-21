import ViteJS from 'vite.js';

import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';
import TestToken from './testToken';
import Token from './token';
import Types from './types';

let WS_RPC = new ViteJS.WS_RPC({
    url: 'ws://192.168.31.50:31420',
    timeout: 15000
});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Net: new net(),
    Ledger: new ledger(),
    TestToken: new TestToken(),
    Token: new Token(ViteJS.BigNumber),
    Types: new Types()
};