import ViteJS from 'vite.js';
window.ViteJS = ViteJS;

import wallet from './wallet';
import account from './account/index';
import net from './net';

let WS_RPC = new ViteJS.WS_RPC({});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Account: new account(),
    Net: new net()
};