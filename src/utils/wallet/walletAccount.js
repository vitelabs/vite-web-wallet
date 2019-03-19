import { keystore as _keystore, hdAccount as _walletAccount } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import acc from 'utils/storeAcc.js';
import $ViteJS from 'utils/viteClient';

class walletAccount extends _walletAccount {
    constructor({
        addrNum, defaultInx, mnemonic, bits, encryptObj, receiveFail, lang
    }) {
        super({
            client: $ViteJS, mnemonic, bits, addrNum, lang
        }, {});

        this.defaultInx = defaultInx || 0;
        this.encryptObj = encryptObj || null;
        this.receiveFail = receiveFail;
        this.unlockAcc = null;
    }

    verify(pass) {
        return !this.encryptObj ? 
            Promise.resolve(false) : 
            _keystore.decrypt(JSON.stringify(this.encryptObj), pass, vitecrypto);
    }

    encrypt(pass) {
        if (!pass) {
            return Promise.reject(false);
        }
        return _keystore.encrypt(this.entropy, pass, null, vitecrypto).then((encryptObj) => {
            let obj = JSON.parse(encryptObj);
            this.encryptObj = obj;
            return encryptObj;
        });
    }

    save(name, index) {
        acc.add({
            name, 
            id: this.id,
            lang: this.lang,
            defaultInx: this.defaultInx,
            addr: this.getDefaultAddr(),
            addrNum: this.addrList.length, 
            encryptObj: this.encryptObj
        }, index);
    }

    setDefaultAddr(address, index) {
        let addrObj = this.addrList[index];
        if (!addrObj || addrObj.hexAddr !== address) {
            return false;
        }

        this.defaultInx = index;
        this.unlock();
        return true;
    }

    getDefaultAddr() {
        return this.addrList[this.defaultInx].hexAddr;
    }

    unlock(intervals = 2000) {
        this.lock();
        this.unlockAcc = this.activateAccount({
            index: this.defaultInx
        }, {
            intervals,
            receiveFailAction: this.receiveFail, 
            duration: -1
        });
        return !!this.unlockAcc;
    }

    lock() {
        this.unlockAcc && this.freezeAccount(this.unlockAcc);
    }

    get balance() {
        if (!this.unlockAcc) {
            return null;
        }
        return this.unlockAcc.balance;
    }
}

export default walletAccount;

