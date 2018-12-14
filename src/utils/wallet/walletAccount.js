import { utils, wallet } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import acc from './storeAcc.js';

const _keystore = utils.keystore;
const _walletAccount = wallet.walletAccount;


class walletAccount extends _walletAccount {
    constructor({
        addrNum, defaultInx, mnemonic, bits, encryptObj, receiveFail
    }) {
        super({
            client: $ViteJS, mnemonic, bits, addrNum
        }, {});

        this.defaultInx = defaultInx || 0;
        this.encryptObj = encryptObj || null;
        this.receiveFail = receiveFail;
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
            defaultInx: this.defaultInx, 
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
        this.unlock({ address });
        return true;
    }

    getDefaultAddr() {
        return this.addrList[this.defaultInx].hexAddr;
    }

    unlock(intervals) {
        let result = this.activateAccount({
            index: this.defaultInx
        }, {
            intervals,
            receiveFailAction: this.receiveFail, 
            duration: -1
        });
        return !!result;
    }

    lock() {
        this.freezeAccount();
    }
}

export default walletAccount;

