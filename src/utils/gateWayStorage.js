import s from 'utils/localStorage';

const STORAGEKEY = 'INDEX_COLLECT_TOKEN';
// data{tokenId:{symbol,gateHost,gateUrl}}
class GateWays {
    constructor() {
        this.updateFromStorage();
    }

    bindToken(tokenId, tokenInfo) {
        this.data[tokenId] = tokenInfo;
        this.saveToStorage();
    }

    unBindToken(tokenId) {
        delete this.data[tokenId];
        this.saveToStorage();
    }

    saveToStorage() {
        s.setItem(STORAGEKEY, this.data);
    }

    updateFromStorage() {
        this.data = s.getItem(STORAGEKEY);
        if (!this.data) {
            s.setItem(STORAGEKEY, {});
            this.data = {};
        }
    }

    get tokens() {
        return Object.keys(this.data);
    }
}

export const collectStorage = new GateWays();
