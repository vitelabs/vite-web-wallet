
const loopTime = require('../../config/loopTime');

let loopHeightTimeout;
let loopSyncInfoTimeout;

class Ledger {
    constructor($ViteJS) {
        this.$ViteJS = $ViteJS;
        this.snapshotChainHeight = null;
        this.syncInfo = null;

        this.loopHeight();
        this.loopSyncInfo();
    }

    loopSyncInfo() {
        let loop = () => {
            loopSyncInfoTimeout = setTimeout(() => {
                clearTimeout(loopSyncInfoTimeout);
                loopSyncInfoTimeout = null;
                this.loopSyncInfo();
            }, loopTime.ledger_getInitSyncInfo);
        };

        this.$ViteJS.Vite.Ledger.getInitSyncInfo().then((data)=>{
            this.syncInfo = data;
            loop();
        }).catch((err)=>{
            console.log(err);

            loop();
        });
    }

    loopHeight() {
        let loop = () => {
            loopHeightTimeout = setTimeout(() => {
                clearTimeout(loopHeightTimeout);
                loopHeightTimeout = null;
                this.loopHeight();
            }, loopTime.ledger_getSnapshotChainHeight);
        };

        this.$ViteJS.Vite.Ledger.getSnapshotChainHeight().then((data)=>{
            this.snapshotChainHeight = data;
            loop();
        }).catch(()=>{
            loop();
        });
    }
}

module.exports = Ledger;
