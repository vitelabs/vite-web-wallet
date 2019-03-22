import { account as _account, keystore as _keystore } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import acc from 'utils/storeAcc.js';
import $ViteJS from 'utils/viteClient';

class keystoreAccount extends _account {
    constructor({ keystore, privateKey, receiveFail }) {
        super({ privateKey, client: $ViteJS });

        this.keystore = keystore;
        this.receiveFail = receiveFail;
        this.unlockAcc = null;
    }

    verify(pass) {
        return this.keystore
            ? _keystore.decrypt(JSON.stringify(this.keystore), pass, vitecrypto)
            : Promise.resolve(false);
    }

    save(name) {
        const item = {
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
