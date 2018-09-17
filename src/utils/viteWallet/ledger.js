import loopTime from 'loopTime';

let loopSyncInfoTimeout = null;
let loopHeightTimeout = null;

class Ledger {
    constructor(services) {
        this.services = services;

        this.targetHeight = '';
        this.currentHeight = '';
        this.status = 1;

        this.__startSyncInfo();
    }

    __syncInfo() {
        return this.services['ledger_getInitSyncInfo']().then((data)=>{
            this.targetHeight = data.TargetHeight;
            this.currentHeight = data.CurrentHeight;
            this.status = data.status;
            webViteEventEmitter.emit('syncInfo', this.getSyncInfo());

            if (this.status !== 2) {
                return;
            }

            this.__stopSyncInfo();
            this.startLoopHeight();

            return data;
        });
    }

    __startSyncInfo() {
        if (this.status === 2) {
            return;
        }

        let loop = ()=>{
            loopSyncInfoTimeout = setTimeout(()=>{
                this.__stopSyncInfo();
                this.__startSyncInfo();
            }, loopTime.ledger_getInitSyncInfo);
        };

        this.__syncInfo().then(()=>{
            loop();
        }).catch(()=>{
            loop();
        });
    }

    __stopSyncInfo() {
        clearTimeout(loopSyncInfoTimeout);
        loopSyncInfoTimeout = null;
    }

    reloadSyncInfo() {
        this.__stopSyncBlock();
        return new Promise((res, rej)=>{
            this.__syncInfo().then(()=>{
                this.__startSyncInfo();
                res( this.getSyncInfo() );
            }).catch((err)=>{
                this.__startSyncInfo();
                rej(err);
            });
        });
    }

    getSyncInfo() {
        return {
            targetHeight: this.targetHeight,
            currentHeight: this.currentHeight,
            status: this.status            
        };
    }

    startLoopHeight() {
        let loop = ()=>{
            loopHeightTimeout = setTimeout(()=>{
                clearTimeout(loopHeightTimeout);
                loopHeightTimeout = null;
                this.startLoopHeight();
            }, loopTime.ledger_getInitSyncInfo);
        };

        this.services['ledger_getSnapshotChainHeight']().then((data)=>{
            this.currentHeight = data;
            webViteEventEmitter.emit('snapshotChainHeight', data);
            loop();
            return data;
        }).catch(()=>{
            loop();
        });
    }

    getHeight() {
        return this.currentHeight;
    }

    // createTX({
    //     selfAddr, toAddr, pass, tokenId, amount
    // }) {
    //     return global.goViteIPC['ledger.CreateTxWithPassphrase']({
    //         SelfAddr: selfAddr,
    //         ToAddr: toAddr,
    //         Passphrase: pass,
    //         TokenTypeId: tokenId,
    //         Amount: amount
    //     });
    // }

    // getTXList({ address, pageIndex, pageNum }) {
    //     return global.goViteIPC['ledger.GetBlocksByAccAddr']({
    //         Addr: address,
    //         Index: pageIndex,
    //         Count: pageNum
    //     }).then((data)=>{
    //         return data || [];
    //     });
    // }
}

export default Ledger;
