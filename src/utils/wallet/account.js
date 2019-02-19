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

        //         accountAddress: "vite_17db10f302569b79adbb31f7dd96a11f09f740459c2e0d8638"
        // blockType: 4
        // fromBlockHash: "865f7ed68d67a4782104abf216f33829e51989c63d13b6a0324a0bbc9e9d57af"
        // hash: "0253ecf78aa15abffc83a8787c69a30509d3ccb53b6c1980c0341c9451f104f1"
        // height: "6"
        // prevHash: "3bfe4a1e4093d3a7a0195d1042e65008d03d202b03aaa4e2a18cb10dbd03325b"
        // publicKey: "kuzthX/o/WfqSQy+cA+TFFPIrJpaf6+74LAnQhUmoVM="
        // signature: "j+YvgU7qgidWtAmmPuh+2eAnvzlq9CoS18gh5qmfTqtVYMvF3XHi0uJTwDReI8yNcGGR9fVq0e9ohEvy0a89CA=="
        // snapshotHash: "2dcb96e8fe69723f9598dea136c038681f92d38e80025ddeb95c5b69574df816"
        // timestamp: 1550561026

        // accountAddress: "vite_17db10f302569b79adbb31f7dd96a11f09f740459c2e0d8638"
        // blockType: 4
        // difficulty: "67108864"
        // fromBlockHash: "865f7ed68d67a4782104abf216f33829e51989c63d13b6a0324a0bbc9e9d57af"
        // hash: "0253ecf78aa15abffc83a8787c69a30509d3ccb53b6c1980c0341c9451f104f1"
        // height: "6"
        // nonce: "KMgNkdjRn8c="
        // prevHash: "3bfe4a1e4093d3a7a0195d1042e65008d03d202b03aaa4e2a18cb10dbd03325b"
        // publicKey: "kuzthX/o/WfqSQy+cA+TFFPIrJpaf6+74LAnQhUmoVM="
        // signature: "j+YvgU7qgidWtAmmPuh+2eAnvzlq9CoS18gh5qmfTqtVYMvF3XHi0uJTwDReI8yNcGGR9fVq0e9ohEvy0a89CA=="
        // snapshotHash: "2dcb96e8fe69723f9598dea136c038681f92d38e80025ddeb95c5b69574df816"
        // timestamp: 1550561026

        // accountAddress: "vite_17db10f302569b79adbb31f7dd96a11f09f740459c2e0d8638"
        // blockType: 4
        // fromBlockHash: "865f7ed68d67a4782104abf216f33829e51989c63d13b6a0324a0bbc9e9d57af"
        // hash: "0d42cd491dd9900f5b08f6c85b7af132fce3a3cf3a87e27a1e58d387464e16e5"
        // height: "6"
        // prevHash: "3bfe4a1e4093d3a7a0195d1042e65008d03d202b03aaa4e2a18cb10dbd03325b"
        // publicKey: "kuzthX/o/WfqSQy+cA+TFFPIrJpaf6+74LAnQhUmoVM="
        // signature: "Z06DOJowDLrDkTyLrM1lURrtRWyz/ABdrpzK3ux/H5oSj0UxW/xo3EdEeF64Xxhxsjk6I1SyFhfQwnqDz6UrCA=="
        // snapshotHash: "365e27569d5e70824b6c6ed3ab92764ca72e6e1cc4e2529aff3a36445e507173"
        // timestamp: 1550560982

        // 'vite_17db10f302569b79adbb31f7dd96a11f09f740459c2e0d8638';
        // 4;
        // '67108864';
        // '865f7ed68d67a4782104abf216f33829e51989c63d13b6a0324a0bbc9e9d57af';
        // '664d2f8eec04a87ca69035a04919f76cc9aed43f8ff9b8309ef6e6ea9a7d958d';
        // '6';
        // 'Nmli03y18UY=';
        // '3bfe4a1e4093d3a7a0195d1042e65008d03d202b03aaa4e2a18cb10dbd03325b';
        // 'kuzthX/o/WfqSQy+cA+TFFPIrJpaf6+74LAnQhUmoVM=';
        // 'weNU0PORgEhEwMfybmOAgHTxXpbbd3LN2jWuAfk6l6bQ7NqSAKMp14ptK3nFkTHMVHCpsNtGWDaqPXvR4FmnAg==';
        // 'f8131da001630b46526ff398ef2dd3a053c76976f664ad0bbee07a75fff174ab';
        // 1550560562;
        let receiveFail = async (err) => {
            if (!err || !err.error || !err.error.code || err.error.code !== -35002 || !err.accountBlock) {
                return Promise.reject(err);
            }

            let accountBlock = err.accountBlock;
            let x = Object.assign({}, accountBlock);
            console.log('error', x);

            let data = await getPowNonce(accountBlock.accountAddress, accountBlock.prevHash);
            accountBlock.difficulty = data.difficulty;
            accountBlock.nonce = data.nonce;
            console.log('error2', accountBlock);

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
