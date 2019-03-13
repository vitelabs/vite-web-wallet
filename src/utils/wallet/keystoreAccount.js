import { account as _account, keystore as _keystore  } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import acc from './storeAcc.js';

class keystoreAccount extends _account {
    constructor({
        keystore, privateKey, receiveFail
    }) {
        super({
            privateKey, client: $ViteJS
        });

        this.keystore = keystore;
        this.receiveFail = receiveFail;
        this.unlockAcc = null;
    }

    verify(pass) {
        return !this.keystore ? 
            Promise.resolve(false) :
            _keystore.decrypt(JSON.stringify(this.keystore), pass, vitecrypto);
    }

    save(name) {
        let item = {
            name,
            addr: this.address,
            keystore: this.keystore
        };
        acc.add(item);
    }

    getDefaultAddr() {
        return this.address;
    }

    unlock(intervals) {
        this.activate(intervals, this.receiveFail);
        this.unlockAcc = this;
        return true;
    }

    lock() {
        this.freeze();
        this.unlockAcc = null;
    }
}

export default keystoreAccount;
