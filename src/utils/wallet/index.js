import { hdAddr as _hdAddr, keystore as _keystore, utils, constant } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import storeAcc from 'utils/storeAcc.js';
import statistics from 'utils/statistics';
import $ViteJS from 'utils/viteClient';

import account from './account.js';

const { LangList } = constant;
const { checkParams } = utils;

class _wallet {
    constructor() {
        this.activeWalletAcc = null;
        this.isLogin = false;
        this.onLoginList = [];
        this.onLogoutList = [];
        this.lastPage = '';

        this.setLastActiveAcc();
    }

    setLastPage(name) {
        this.lastPage = name;
    }

    clearLastPage() {
        this.lastPage = '';
    }

    getActiveAccount() {
        return this.activeWalletAcc;
    }

    clearActiveAccount() {
        if (!this.activeWalletAcc) {
            return;
        }
        this.activeWalletAcc.lock && this.activeWalletAcc.lock();
        this.setLastActiveAcc();
    }

    setLastActiveAcc() {
        const lastAccount = this.getLast();
        if (!lastAccount || !lastAccount.addr) {
            return;
        }

        this.newActiveAcc({
            type: 'address',
            address: lastAccount.addr,
            name: lastAccount.name,
            id: lastAccount.id,
            entropy: lastAccount.entropy
        });
    }

    newActiveAcc(acc) {
        if (!this.activeWalletAcc) {
            this.activeWalletAcc = new account(acc);
            return;
        }
        this.activeWalletAcc.lock && this.activeWalletAcc.lock();
        this.activeWalletAcc._init(acc);
    }

    create(name, pass, lang = LangList.english) {
        const err = checkParams({ name, pass }, [ 'name', 'pass' ]);
        if (err) {
            console.error(new Error(err));
            return;
        }

        this.newActiveAcc({
            addrNum: 1,
            name,
            pass,
            lang,
            type: 'wallet'
        });
    }

    importKeystore(data) {
        const keystore = _keystore.isValid(data);
        if (!keystore) {
            return false;
        }

        this.newActiveAcc({
            keystore,
            type: 'keystore'
        });
        this.activeWalletAcc.save();

        return keystore.hexaddress;
    }

    async restoreAccount(mnemonic, name, pass, lang = LangList.english) {
        const num = 10;
        const addrs = _hdAddr.getAddrsFromMnemonic(mnemonic, 0, num, lang);
        if (!addrs) {
            return Promise.reject({ code: 500005 });
        }

        const requests = [];
        for (let i = 0; i < num; i++) {
            requests.push($ViteJS.getBalance(addrs[i].hexAddr));
        }

        const data = await Promise.all(requests);
        let index = 0;

        data.forEach((item, i) => {
            if (!item) {
                return;
            }
            const account = item.balance;
            const onroad = item.onroad;
            if ((account && +account.totalNumber) || (onroad && +onroad.totalNumber)) {
                index = i;
            }
        });

        this.newActiveAcc({
            addrNum: index + 1,
            mnemonic,
            lang,
            type: 'wallet'
        });

        return this.activeWalletAcc.encrypt(pass).then(() => {
            this.activeWalletAcc.pass = pass;
            this.activeWalletAcc.rename(name);
        });
    }

    onLogin(cb) {
        this.onLoginList = this.onLoginList || [];
        this.onLoginList.push(cb);
    }

    onLogout(cb) {
        this.onLogoutList = this.onLogoutList || [];
        this.onLogoutList.push(cb);
    }

    logout() {
        this.activeWalletAcc && this.activeWalletAcc.lock();
        this.activeWalletAcc && this.activeWalletAcc.releasePWD();
        this.clearActiveAccount();
        this.isLogin = false;
        this.onLogoutList && this.onLogoutList.forEach(cb => {
            cb && cb();
        });
    }

    login({ id, entropy, addr }, pass) {
        if ((!entropy && !addr && !id) || !pass) {
            return Promise.reject(false);
        }

        if (addr && !entropy && !id) {
            this.isLogin = this._loginKeystoreAcc(addr, pass);
            return this.isLogin;
        }

        return this._loginWalletAcc({ id, entropy, pass }).then(data => {
            this.isLogin = true;
            this.onLoginList && this.onLoginList.forEach(cb => {
                cb && cb();
            });

            return data;
        });
    }

    async _loginKeystoreAcc(addr, pass) {
        const acc = getAccFromAddr(addr);
        const keystore = acc.keystore;

        const before = new Date().getTime();

        const privKey = await _keystore.decrypt(JSON.stringify(keystore), pass, vitecrypto);

        const after = new Date().getTime();
        const n = (keystore.crypto && keystore.crypto.scryptparams && keystore.crypto.scryptparams.n)
            ? keystore.crypto.scryptparams.n : 0;
        statistics.event('keystore-decrypt', n, 'time', after - before);

        if (n !== 262144) {
            this.newActiveAcc({
                name: acc.name,
                pass,
                keystore,
                privateKey: privKey,
                type: 'keystore'
            });
            storeAcc.setLast({
                addr,
                name: acc.name
            });

            return true;
        }

        // Reduce the difficuly. 262144 to 4096
        const keystoreStr = await _keystore.encryptOldKeystore(privKey, pass, vitecrypto);
        this.newActiveAcc({
            name: acc.name,
            pass,
            keystore: JSON.parse(keystoreStr),
            privateKey: privKey,
            type: 'keystore'
        });
        this.activeWalletAcc.save();

        storeAcc.setLast({
            addr,
            name: acc.name
        });

        return true;
    }

    async _loginWalletAcc({ id, entropy, pass }) {
        let acc;
        let i;

        if (id) {
            acc = getAccFromId(id);
        } else {
            const result = getAccFromEntropy(entropy);
            if (result) {
                acc = result.account;
                i = result.index;
                id = result.id || null;
            }
        }

        const encryptObj = acc.encryptObj;
        entropy = entropy || encryptObj.encryptentropy;
        // Very very impotant!!!!!
        encryptObj.encryptentropy = encryptObj.encryptentropy || entropy;

        const before = new Date().getTime();
        const decryptEntropy = await _keystore.decrypt(JSON.stringify(encryptObj), pass, vitecrypto);
        const after = new Date().getTime();
        statistics.event('mnemonic-decrypt', encryptObj.version || '1', 'time', after - before);

        if (!decryptEntropy) {
            return false;
        }

        const lang = acc.lang || LangList.english;
        const mnemonic = _hdAddr.getMnemonicFromEntropy(decryptEntropy, lang);
        const defaultInx = +acc.defaultInx > 10 || +acc.defaultInx < 0 ? 0 : +acc.defaultInx;

        this.newActiveAcc({
            pass,
            defaultInx,
            encryptObj: acc.encryptObj,
            addrNum: acc.addrNum,
            name: acc.name,
            mnemonic,
            lang,
            type: 'wallet'
        });

        if (!id) {
            statistics.event('keystore', 'resave-id');
            this.activeWalletAcc.save(i);
        }

        storeAcc.setLast({
            id,
            entropy,
            name: acc.name
        });
        this.activeWalletAcc.save();

        return true;
    }

    getList() {
        return storeAcc.getList();
    }

    getLast() {
        if (this.activeWalletAcc) {
            return {
                id: this.activeWalletAcc.getId(),
                entropy: this.activeWalletAcc.getEntropy(),
                addr: this.activeWalletAcc.getDefaultAddr(),
                name: this.activeWalletAcc.name
            };
        }

        const last = storeAcc.getLast();
        if (!last) {
            return null;
        }

        let acc;
        if (last.addr) {
            acc = getAccFromAddr(last.addr);
        } else if (last.id) {
            acc = getAccFromId(last.id);
        } else {
            const result = getAccFromEntropy(last.entropy);
            if (result) {
                acc = result.account;
            }
        }

        if (!acc) {
            return null;
        }

        return acc;
    }
}


export const wallet = new _wallet();


function getAccFromId(id) {
    const list = storeAcc.getList();
    if (!list) {
        return null;
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].id && list[i].id === id) {
            return list[i];
        }
    }

    return null;
}

function getAccFromEntropy(entropy) {
    let result = null;
    const list = storeAcc.getList();
    for (let i = 0; i < list.length; i++) {
        if (list[i].entropy === entropy) {
            if (!list[i].id) {
                return {
                    account: list[i],
                    index: i
                };
            }
            result = {
                account: list[i],
                index: i,
                id: list[i].id
            };
        }
    }

    return result;
}

function getAccFromAddr(address) {
    const list = storeAcc.getList();
    for (let i = 0; i < list.length; i++) {
        if (list[i].addr === address) {
            return list[i];
        }
    }

    return null;
}
