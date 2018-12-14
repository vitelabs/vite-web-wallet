import { utils, wallet  } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import acc from './storeAcc.js';

const _keystore = utils.keystore;
const _account = wallet.account;

class keystoreAccount extends _account {
    constructor({
        keystore, privateKey, receiveFail
    }) {
        super({
            privateKey, client: $ViteJS
        });

        this.keystore = keystore;
        this.receiveFail = receiveFail;
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
        return true;
    }

    lock() {
        this.freeze();
    }
}

export default keystoreAccount;
