export default function(ViteJS) {
    let HTTP_RPC = new ViteJS.HTTP_RPC({
        host: 'http://127.0.0.1:8080/',
        timeout: 15000
    });

    return {
        netStatus: function() {
            return HTTP_RPC.request('netStatus').then(({ result }) => {
                return result;
            });
        },
        p2pStatus: function() {
            return HTTP_RPC.request('p2p_networkAvailable').then(({ result }) => {
                return result;
            });
        },
        ledger_getInitSyncInfo: function() {
            return HTTP_RPC.request('ledger_getInitSyncInfo').then(({ result }) => {
                return result;
            });
        },
        ledger_getSnapshotChainHeight: function() {
            return HTTP_RPC.request('ledger_getSnapshotChainHeight').then(({ result }) => {
                return result;
            });
        }
    };
}
