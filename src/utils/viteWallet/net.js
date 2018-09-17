import loopTime from 'loopTime';

let loopP2PTimeout = null;
let loopNetTimeout = null;

class Net {
    constructor(services) {
        this.services = services;
        this.p2pStatus = false;
        this.clientStatus = -1;
        this.netStatus = -1;

        window.addEventListener('online', this._updateClientNet);
        window.addEventListener('offline', this._updateClientNet);
        this._updateClientNet();

        this.loopNetStatus();
        this.loopP2PStatus();
    }

    _updateClientNet() {
        this.clientStatus = navigator.onLine;
        // offline
        !this.clientStatus && window.webViteEventEmitter.emit('netStatus', false);
        this.clientStatus && window.webViteEventEmitter.emit('netStatus', this.netStatus);
    }

    loopNetStatus() {
        let loop = ()=>{
            loopNetTimeout = setTimeout(()=>{
                clearTimeout(loopNetTimeout);
                loopNetTimeout = null;
                window.webViteEventEmitter.emit('netStatus', this.netStatus);
                this.loopNetStatus();
            }, loopTime.netStatus);
        };

        this.services.netStatus().then(()=>{
            this.netStatus = true;
            loop();
        }).catch((err)=>{
            console.warn(err);
            this.netStatus = false;
            loop();
        });
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

        this.services.p2pStatus().then((data)=>{
            this.p2pStatus = data;
            loop();
        }).catch(()=>{
            loop();
        });
    }

    getNetStatus() {
        if (!this.clientStatus) {
            return false;
        }
        return this.netStatus;
    }

    getP2PStatus() {
        return this.p2pStatus;
    }
}

export default Net;
