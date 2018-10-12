class Net {
    constructor() {
        this.clientStatus = -1;

        window.addEventListener('online', this._updateClientNet);
        window.addEventListener('offline', this._updateClientNet);
        this._updateClientNet();
    }

    _updateClientNet() {
        this.clientStatus = navigator.onLine;
        window.webViteEventEmitter.emit('netStatus', this.clientStatus);
    }

    getNetStatus() {
        this._updateClientNet();
        return this.clientStatus;
    }
}

export default Net;
