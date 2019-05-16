import { constant } from '@vite/vitejs';
import { pwdConfirm } from 'components/password/index.js';
import localStorage from 'utils/store';

import walletAcc from './walletAccount';
import addrAcc from './addrAccount';

const { LangList } = constant;
const AccountType = {
    wallet: 'wallet',
    addr: 'address'
};
const HoldPwdKey = 'isHoldPWD';

class account {
    constructor({
        // AddrAccount
        address, id, entropy,
        // Account
        name, pass, type,
        // WalletAccount
        addrNum, defaultInx, mnemonic, keystore, lang
    }) {
        this._init({
            address,
            id,
            entropy,
            name,
            pass,
            type,
            addrNum,
            defaultInx,
            mnemonic,
            lang,
            keystore
        });
    }

    _init({
        // AddrAccount
        address, id, entropy,
        // Account
        name, pass, type,
        // WalletAccount
        addrNum, defaultInx, mnemonic, keystore, lang
    }) {
        this.isHoldPWD = !!localStorage.getItem(HoldPwdKey);
        this.type = type;
        this.pass = pass || '';
        this.name = name || '';

        if (this.type === AccountType.wallet) {
            this.account = new walletAcc({ addrNum, defaultInx, mnemonic, keystore, lang });
        } else if (this.type === AccountType.addr) {
            this.account = new addrAcc({ address, id, entropy });
        } else {
            this.account = null;
        }

        this.account && this.checkFunc();
    }

    get isLogin() {
        return !this.type === AccountType.addr;
    }

    checkFunc() {
        const funcName = [
            'sendRawTx', 'sendTx', 'receiveTx', 'sendPowTx'
        ];

        funcName.forEach(name => {
            this[name] = (...args) => {
                if (!this.account || !this.account.unlockAcc) {
                    return Promise.reject('No unlockAcc');
                }
                return this.account.unlockAcc[name](...args);
            };
        });

        [ 'getBalance', 'lock', 'sign' ].forEach(name => {
            this[name] = (...args) => this.account[name] && this.account[name](...args);
        });
    }

    holdPWD(pwd) {
        this.pass = pwd;
        this.isHoldPWD = true;
        localStorage.setItem(HoldPwdKey, true);
    }

    releasePWD() {
        this.isHoldPWD = false;
        localStorage.setItem(HoldPwdKey, false);
    }

    unlockAccount() {
        if (this.isLogin) {
            return;
        }
        pwdConfirm({ type: 'unlockAccount' });
    }

    initPwd({
        showMask = true,
        title,
        submit = () => {},
        cancel = () => {},
        content = '',
        submitTxt = '',
        cancelTxt = '',
        exchange = false
    }, isConfirm = false) {
        const isHide = !isConfirm && this.isHoldPWD;

        if (isHide) {
            submit && submit();
            return true;
        }

        pwdConfirm({ showMask, title, submit, content, cancel, cancelTxt, submitTxt, exchange }, !this.isHoldPWD);
        return false;
    }

    getId() {
        return this.account.id;
    }

    getEntropy() {
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
        this.account.save(this.name, index);
    }

    changeMnemonic(len, lang = LangList.english) {
        const bits = len === 12 ? 128 : 256;

        this.type = AccountType.wallet;
        this.account = new walletAcc({
            addrNum: 1,
            bits,
            lang
        });
    }

    getMnemonic() {
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

    setAddrName(addr, idx, name) {
        if (this.type !== AccountType.wallet) {
            return;
        }
        localStorage.setItem(addr, { name, idx });
    }

    addAddr() {
        this.account.addAddr();
        this.account.save(this.name);
        return true;
    }

    getAddrList() {
        const getAddrName = hexAddr => {
            const obj = localStorage.getItem(hexAddr) || {};
            return obj.name || '';
        };

        if (this.type === AccountType.addr) {
            return [{
                addr: this.account.address,
                name: getAddrName(this.account.address)
            }];
        }

        const addrs = [];
        const list = this.account.addrList;
        list.forEach(({ hexAddr }) => {
            addrs.push({
                addr: hexAddr,
                name: getAddrName(hexAddr)
            });
        });

        return addrs;
    }

    setDefaultAddr(addr, index) {
        if (!this.account || !this.account.setDefaultAddr) {
            return false;
        }

        const result = this.account.setDefaultAddr(addr, index);
        result && this.save();

        return result;
    }

    getDefaultAddr() {
        return this.account.getDefaultAddr();
    }

    unlock() {
        if (!this.account) {
            return false;
        }

        const result = this.account.unlock(2000);
        return result;
    }

    syncGetBalance() {
        if (!this.account) {
            return null;
        }

        return this.account.balance;
    }

    get privateKey() {
        if (this.account) {
            return this.account.privateKey;
        }
        return null;
    }
}

export default account;
