import { pwdConfirm } from 'components/password/index.js';
import { getPowNonce } from 'services/pow';
import { constant } from '@vite/vitejs';

import keystoreAcc from './keystoreAccount';
import walletAcc from './walletAccount';
import acc from './storeAcc.js';

const { type } = constant;
const NamePre = 'account';
const AccountType = {
    keystore: 'keystore',
    wallet: 'wallet'
};
let passTimeout;

class account {
    constructor({
        name, pass, type,                                   // account
        addrNum, defaultInx, mnemonic, encryptObj, lang,    // walletAccount
        keystore, privateKey                                // keystoreAccount
    }) {
        this.isHoldPWD = false;
        this.type = type;
        this.pass = pass || '';
        this.name = checkName(name);

        let receiveFail = async (err) => {
            if (!err || !err.error || !err.error.code || err.error.code !== -35002 || !err.accountBlock) {
                return Promise.reject(err);
            }

            let accountBlock = err.accountBlock;
            let data = await getPowNonce(accountBlock.accountAddress, accountBlock.prevHash);
            accountBlock.difficulty = data.difficulty;
            accountBlock.nonce = data.nonce;

            return this.account.sendRawTx(accountBlock);
        };

        this.keystore = null;
        if (this.type === AccountType.keystore) {
            if (privateKey) {
                this.account = new keystoreAcc({
                    keystore, privateKey, receiveFail
                });
            } else {
                this.keystore = keystore;
            }
        } else if (this.type === AccountType.wallet) {
            this.account = new walletAcc({
                addrNum, defaultInx, mnemonic, encryptObj, receiveFail, lang
            });
        } else {
            this.account = null;
        }

        this.account && this.checkFunc();
    }

    checkFunc() {
        let funcName = ['lock', 'getBalance', 'sendRawTx', 'sendTx', 'receiveTx', 'SBPreg', 'updateReg', 'revokeReg', 'retrieveReward', 'voting', 'revokeVoting', 'getQuota', 'withdrawalOfQuota', 'createContract', 'callContract'];
        funcName.forEach((name) => {
            this[name] = (...args) => {
                return this.account[name](...args);
            };
        });
    }

    holdPWD(pwd, time) {
        this.pass = pwd;
        this.isHoldPWD = true;
        passTimeout = setTimeout(() => {
            this.releasePWD();
        }, time);
    }

    releasePWD() {
        passTimeout && clearTimeout(passTimeout);
        passTimeout = null;
        this.isHoldPWD = false;
        window.isShowPWD = false;
    }

    initPwd({
        showMask = true,
        title,
        submit = () => {},
        cancel = () => {},
        content = '',
        submitTxt = '',
        cancelTxt = '',
        exchange=false
    }, isConfirm = false) {
        let isHide = !isConfirm && this.isHoldPWD;

        if (isHide) {
            submit && submit();
            return true;
        }

        pwdConfirm({
            showMask, title, submit, content, cancel, cancelTxt, submitTxt,exchange
        }, !this.isHoldPWD);
        return false;
    }

    getId() {
        if (this.type === AccountType.keystore) {
            return null;
        }
        return this.account.id;
    }

    getEntropy() {
        if (this.type === AccountType.keystore) {
            return null;
        }
        return this.account.entropy;
    }

    verify(pass) {
        if (this.pass) {
            return Promise.resolve(this.pass === pass);
        }
        return this.account.verify(pass);
    }

    encrypt(pass) {
        if (this.type !== AccountType.wallet || (!this.pass && !pass)) {
            return Promise.reject(false);
        }
        pass && (this.pass = pass);
        return this.account.encrypt(this.pass);
    }

    save(index = -1) {
        this.name = checkName(this.name);
        if (!this.account && this.type === AccountType.keystore) {
            acc.add({
                name: this.name,
                addr: this.keystore.hexaddress,
                keystore: this.keystore
            });
            return;
        }
        this.account.save(this.name, index);
    }

    changeMnemonic(len, lang = type.LangList.english) {
        let bits = len === 12 ? 128 : 256;

        this.type = AccountType.wallet;
        this.account = new walletAcc({
            addrNum: 1,
            bits,
            lang
        });
    }

    getMnemonic() {
        if (this.type === AccountType.keystore) {
            return null;
        }
        return this.account.mnemonic;
    }

    getName() {
        return this.name;
    }

    rename(name) {
        if (!name) {
            return;
        }
        this.name = name;
        this.save();
    }

    addAddr() {
        if (this.type === AccountType.keystore) {
            return false;
        }
        this.account.addAddr();
        this.account.save(this.name);
        return true;
    }

    getAddrList() {
        if (this.type === AccountType.keystore) {
            return [this.account.address];
        }

        let addrs = [];
        let list = this.account.addrList;
        list.forEach(({ hexAddr }) => {
            addrs.push(hexAddr);
        });
        return addrs;
    }

    setDefaultAddr(addr, index) {
        if (this.type === AccountType.keystore) {
            return true;
        }
        let result = this.account.setDefaultAddr(addr, index);
        result && this.save();
        return result;
    }

    getDefaultAddr() {
        if (!this.account && this.type === AccountType.keystore) {
            return this.keystore.hexaddress;
        }
        return this.account.getDefaultAddr();
    }

    unlock() {
        if (!this.account) {
            return false;
        }

        let result = this.account.unlock(2000);
        return result;
    }

    syncGetBalance() {
        if (!this.account) {
            return null;
        }
        return this.account.balance;
    }
}

export default account;



function checkName(name) {
    if (name) {
        return name;
    }
    let count = acc.getNameCount();
    name = `${NamePre}${count}`;
    acc.setNameCount(count + 1);
    return name;
}
