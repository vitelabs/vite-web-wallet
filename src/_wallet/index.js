import { hdAddr as _hdAddr, keystore as _keystore, utils, constant } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import { getAccList, getLastAcc, setLastAcc } from 'utils/store';
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

        this.setLastActiveAcc();
    }

    getActiveAccount() {
        return this.activeWalletAcc;
    }

    get activeAccount() {
        return this.activeWalletAcc;
    }

    get defaultAddr() {
        if (!this.activeAccount) return '';
        return this.activeAccount.getDefaultAddr();
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
            entropy: lastAccount.entropy,
            addrName: lastAccount.addrName || ''
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
            type: 'wallet',
            addrNameList: {}
        });
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
        this.clearActiveAccount();
        this.isLogin = false;
        this.onLogoutList && this.onLogoutList.forEach(cb => {
            cb && cb();
        });
    }

    login({ id, entropy, addr }, pass) {
        console.log(id, entropy, addr);

        if ((!entropy && !addr && !id) || !pass) {
            return Promise.reject(false);
        }

        return this._loginWalletAcc({ id, entropy, pass }).then(data => {
            this.isLogin = true;
            this.onLoginList && this.onLoginList.forEach(cb => {
                cb && cb();
            });

            return data;
        });
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

        const keystore = acc.keystore;
        entropy = entropy || keystore.encryptentropy;
        // Very very impotant!!!!!
        keystore.encryptentropy = keystore.encryptentropy || entropy;

        const before = new Date().getTime();
        const decryptEntropy = await _keystore.decrypt(JSON.stringify(keystore), pass, vitecrypto);
        const after = new Date().getTime();
        statistics.event('mnemonic-decrypt', keystore.version || '1', 'time', after - before);

        if (!decryptEntropy) {
            return false;
        }

        const lang = acc.lang || LangList.english;
        const mnemonic = _hdAddr.getMnemonicFromEntropy(decryptEntropy, lang);
        const defaultInx = +acc.Idx > 10 || +acc.Idx < 0 ? 0 : +acc.Idx;

        this.newActiveAcc({
            pass,
            defaultInx,
            keystore: acc.keystore,
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

        setLastAcc({
            id,
            entropy,
            name: acc.name
        });
        this.activeWalletAcc.save();

        return true;
    }

    getList() {
        return getAccList();
    }

    getLast() {
        if (this.activeWalletAcc) {
            return {
                id: this.activeWalletAcc.getId(),
                addr: this.activeWalletAcc.getDefaultAddr(),
                name: this.activeWalletAcc.name
            };
        }

        const last = getLastAcc();
        if (!last) {
            return null;
        }

        let acc;
        if (last.addr) {
            acc = getAccFromAddr(last.addr);
        } else if (last.id) {
            acc = getAccFromId(last.id);
        }

        if (!acc) {
            return null;
        }

        return acc;
    }
}


export const wallet = new _wallet();


function getAccFromId(id) {
    const list = getAccList();
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
    const list = getAccList();
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
    const list = getAccList();
    for (let i = 0; i < list.length; i++) {
        if (list[i].addr === address) {
            return list[i];
        }
    }

    return null;
}
