import ViteJS from 'vite.js';
window.ViteJS = ViteJS;

import initServices from '../services/index';
import wallet from './wallet/index';
import net from './net';
import ledger from './ledger';

window.$ViteJS = new ViteJS(null);
let services = initServices(ViteJS);

window.viteWallet = {
    Wallet: new wallet(services),
    Net: new net(services),
    Ledger: new ledger(services)
};