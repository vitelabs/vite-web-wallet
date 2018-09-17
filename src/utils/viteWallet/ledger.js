import loopTime from 'loopTime';

let loopSyncInfoTimeout = null;

class Ledger {
    constructor(services) {
        this.services = services;

        this.startHeight = '';
        this.targetHeight = '';
        this.currentHeight = '';
        this.isFirstSyncDone = false;
        this.isStartFirstSync = false;

        this.__startSyncInfo();
    }

    __syncInfo() {
        return this.services['ledger_getInitSyncInfo']().then((data)=>{
            console.log(data.IsFirstSyncDone);

            this.startHeight = data.StartHeight;
            this.targetHeight = data.TargetHeight;
            this.currentHeight = data.CurrentHeight;
            this.isFirstSyncDone = data.IsFirstSyncDone;
            this.isStartFirstSync = data.IsStartFirstSync;
            console.log(this.isFirstSyncDone);
            this.isFirstSyncDone && this.__stopSyncInfo();
            webViteEventEmitter.emit('syncInfo', this.getSyncInfo());

            return data;
        });
    }

    __startSyncInfo() {
        console.log(this.isFirstSyncDone);
        if (this.isFirstSyncDone) {
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

    __getStatus() {
        if (this.isFirstSyncDone) {
            return 2;
        }
        if (!this.isStartFirstSync) {
            return 0;
        }
        return 1;
    }
    
    reloadSyncInfo() {
        this.__stopSyncBlock();
        return new Promise((res, rej)=>{
            this.__syncBlock().then(()=>{
                this.__startSyncInfo();
                res({
                    targetHeight: this.targetHeight,
                    currentHeight: this.currentHeight,
                    status: this.__getStatus()
                });
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
            status: this.__getStatus()            
        };
    }

    getBlockHeight() {
        return this.services['ledger_getSnapshotChainHeight']();
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
