
import loopTime from 'loopTime';

let loopHeightTimeout;
let loopSyncInfoTimeout;

class Ledger {
    constructor() {
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

        $ViteJS.Vite.Ledger.getInitSyncInfo().then(({ result })=>{
            console.log(result);

            this.startHeight = result.startHeight;
            this.targetHeight = result.targetHeight;
            this.currentHeight = result.currentHeight;
            this.isFirstSyncDone = result.isFirstSyncDone;
            this.isStartFirstSync = result.isStartFirstSync;

            webViteEventEmitter.emit('currentHeight', this.currentHeight);
            webViteEventEmitter.emit('syncInfo', this.getSyncInfo());

            if (this.isFirstSyncDone) {
                this.stopLoopSyncInfo();
                return;
            }
            loop();
        }).catch(()=>{
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

        $ViteJS.Vite.Ledger.getSnapshotChainHeight().then(({ result })=>{
            this.currentHeight = result;
            webViteEventEmitter.emit('currentHeight', this.currentHeight);

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

    getHeight() {
        return this.currentHeight;
    }

    getBlocks({
        addr, index
    }) {
        return $ViteJS.Vite.Ledger.getBlocksByAccAddr({
            addr, index
        });
    }
}

export default Ledger;
