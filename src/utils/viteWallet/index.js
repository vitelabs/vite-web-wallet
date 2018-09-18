import ViteJS from 'vite.js';
// window.ViteJS = ViteJS;

import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';
import account from './account';
import TestToken from './testToken';

let WS_RPC = new ViteJS.WS_RPC({
    timeout: 15000
});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Net: new net(),
    Ledger: new ledger(),
    Account: new account(),
    TestToken: new TestToken()
};