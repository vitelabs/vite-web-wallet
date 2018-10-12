
import loopTime from 'loopTime';

let loopHeightTimeout;

class Ledger {
    constructor() {
        this.currentHeight = '';
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
            if (result) {
                this.currentHeight = result;
                webViteEventEmitter.emit('currentHeight', this.currentHeight);
            }

            loop();
        }).catch(()=>{
            loop();
        });
    }

    getHeight() {
        return this.currentHeight;
    }

    getBlocks({
        addr, index, pageCount = 50
    }) {
        return $ViteJS.Vite.Ledger.getBlocks({
            addr, index, pageCount, needTokenInfo: true
        });
    }
}

export default Ledger;
