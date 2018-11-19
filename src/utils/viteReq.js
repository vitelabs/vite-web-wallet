import ViteJS from '@vite/vitejs';

process.env.NODE_ENV !== 'production' && console.log(process.env.goViteServer);

let reconnectTimes = 0;
let WS_RPC = new ViteJS.WS_RPC({
    url: process.env.goViteServer,
    timeout: 60000
});
WS_RPC.on('connect', () => {
    reconnectTimes = 0;
    viteWallet && viteWallet.Ledger.loopHeight();
    viteWallet && viteWallet.Ledger.getDefaultTokenList();
});
WS_RPC.on('close', () => {
    if (reconnectTimes > 10) {
        return;
    }
    setTimeout(() => {
        reconnectTimes++;
        WS_RPC.reconnect();
    }, 10000);
});

export default WS_RPC;