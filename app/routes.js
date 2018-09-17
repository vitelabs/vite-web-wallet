module.exports = function({ P2P, Ledger }) {
    console.log(P2P);

    return {
        p2p_networkAvailable: function (args, callback) {
            callback(null, P2P.network);
        },
        ledger_getInitSyncInfo: function (args, callback) {
            callback(null, Ledger.getSyncInfo());
        },
        ledger_getSnapshotChainHeight: function (args, callback) {
            callback(null, Ledger.currentHeight);
        },
        netStatus: function (args, callback) {
            callback(null, true);
        }
    };
};
