import ViteJS from 'vite.js';

import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';

let WS_RPC = new ViteJS.WS_RPC({
    url: 'wss://testnet.vitewallet.com/ws',
    timeout: 60000
});
window.$ViteJS = new ViteJS(WS_RPC);

window.viteWallet = {
    Wallet: new wallet(),
    Net: new net(),
    Ledger: new ledger(),
    BigNumber: new bignumber(),
    Types: new Types(),
    TestToken: new TestToken($ViteJS._currentProvider)
};