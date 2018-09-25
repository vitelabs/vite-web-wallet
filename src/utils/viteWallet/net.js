import loopTime from 'loopTime';

let loopP2PTimeout = null;

class Net {
    constructor() {
        this.p2pStatus = false;
        this.clientStatus = -1;

        window.addEventListener('online', this._updateClientNet);
        window.addEventListener('offline', this._updateClientNet);
        this._updateClientNet();

        this.loopP2PStatus();
    }

    _updateClientNet() {
        this.clientStatus = navigator.onLine;
        window.webViteEventEmitter.emit('netStatus', this.clientStatus);
    }

    loopP2PStatus() {
        let loop = ()=>{
            loopP2PTimeout = setTimeout(()=>{
                clearTimeout(loopP2PTimeout);
                loopP2PTimeout = null;
                window.webViteEventEmitter.emit('p2pStatus', this.p2pStatus);
                this.loopP2PStatus();
            }, loopTime.p2p_networkAvailable);
        };

        $ViteJS.Vite.P2P.networkAvailable().then(({ result })=>{
            this.p2pStatus = result;
            loop();
        }).catch(()=>{
            loop();
        });
    }

    getNetStatus() {
        this._updateClientNet();
        return this.clientStatus;
    }

    getP2PStatus() {
        return this.p2pStatus;
    }
}

export default Net;
