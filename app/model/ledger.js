
const loopTime = require('../../config/loopTime');

let loopHeightTimeout;
let loopSyncInfoTimeout;

class Ledger {
    constructor($ViteJS) {
        this.$ViteJS = $ViteJS;

        this.startHeight = '';
        this.targetHeight = '';
        this.currentHeight = '';
        this.isFirstSyncDone = false;
        this.isStartFirstSync = false;

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

        this.$ViteJS.Vite.Ledger.getInitSyncInfo().then(({ result })=>{
            this.startHeight = result.StartHeight;
            this.targetHeight = result.TargetHeight;
            this.currentHeight = result.CurrentHeight;
            this.isFirstSyncDone = result.IsFirstSyncDone;
            this.isStartFirstSync = result.IsStartFirstSync;

            if (this.isFirstSyncDone) {
                this.stopLoopSyncInfo();
                return;
            }
            loop();
        }).catch((err)=>{
            console.log(err);
            loop();
        });
    }

    stopLoopSyncInfo() {
        clearTimeout(loopSyncInfoTimeout);
        loopSyncInfoTimeout = null;
        this.loopHeight();
    }

    loopHeight() {
        let loop = () => {
            loopHeightTimeout = setTimeout(() => {
                clearTimeout(loopHeightTimeout);
                loopHeightTimeout = null;
                this.loopHeight();
            }, loopTime.ledger_getSnapshotChainHeight);
        };

        this.$ViteJS.Vite.Ledger.getSnapshotChainHeight().then(({ result })=>{
            this.currentHeight = result;
            loop();
        }).catch(()=>{
            loop();
        });
    }

    getSyncInfo() {
        let status = 1;
        if (this.isFirstSyncDone) {
            status = 2;
        }
        if (!this.isStartFirstSync) {
            status = 0;
        }

        return {
            targetHeight: this.targetHeight,
            currentHeight: this.currentHeight,
            status           
        };
    }
}

module.exports = Ledger;
