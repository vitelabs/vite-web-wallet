import WS_RPC from '@vite/vitejs-ws';
import { ViteAPI } from '@vite/vitejs';


/*
    Why add this code?
    apiServer and dnsHostIP are utils tool for both mobile and web. But in web,
    we need use pcUtils to read currentNode from localstorage, and then used in dnsHostIP. But if we put this code
    to dnsHostIP, that will cause dnsHostIP dependence on pcUtils.
    So we move these code here, so that dnsHostIP will not dependence on pcUtils.

    In dnsHostIP, we can read currentNode from window.VITE_NODE_API;
*/
import {
    storage as localStorage,
    constant
} from 'pcUtils/store';

const { CurrentNode } = constant;
const defaultNode = process.env.goViteServer;
window.VITE_NODE_API = localStorage.getItem(CurrentNode) || defaultNode;
/*  end   */


export const checkApi = node => new Promise((resolve, reject) => {
    const startTime = new Date().getTime();
    const timeout = 3000;
    const wsProvider = new WS_RPC(node, timeout, {
        retryTimes: 1,
        retryInterval: 1
    });
    const viteClient = new ViteAPI(wsProvider, () => {
        console.log('Connected');
    });
    viteClient.request('ledger_getSnapshotChainHeight').then(result => {
        wsProvider.destroy();
        resolve({
            ping: new Date().getTime() - startTime,
            blockHeight: result
        });
    }).catch(err => {
        wsProvider.destroy();
        reject(err);
    });
    setTimeout(() => {
        wsProvider.destroy();
        reject('timeout');
    }, timeout);
});
