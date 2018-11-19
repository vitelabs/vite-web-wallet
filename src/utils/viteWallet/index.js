import ViteJS from '@vite/vitejs';
import WS_RPC from 'utils/viteReq.js';
import net from './net';
import ledger from './ledger';
import bignumber from './bignumber';
import Types from './types';
import TestToken from './testToken';
import pledge from './pledge';
import pow from './pow';

window.$ViteJS = new ViteJS(WS_RPC);
window.viteWallet = {
    utils: ViteJS.utils,
    Vite: $ViteJS.Vite,
    Net: new net(),
    Ledger: new ledger(),
    Pow: new pow($ViteJS._currentProvider, ViteJS.utils),
    BigNumber: new bignumber(),
    Types: new Types(),
    TestToken: new TestToken($ViteJS._currentProvider),
    Pledge: new pledge()
};