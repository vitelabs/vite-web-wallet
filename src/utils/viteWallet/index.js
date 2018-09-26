import ViteJS from 'vite.js';

import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';

let WS_RPC = new ViteJS.WS_RPC({
    url: 'wss://test.vitewallet.com',
    timeout: 15000
});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Net: new net(),
    Ledger: new ledger(),
    BigNumber: new bignumber(ViteJS.BigNumber),
    Types: new Types()
};