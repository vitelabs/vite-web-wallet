import { hdAddr as _hdAddr, keystore as _keystore, utils, constant } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import statistics from 'utils/statistics';
import storage from 'utils/localStorage.js';

import account from './account.js';
import acc from './storeAcc.js';

const { LangList } = constant;
const _tools = utils.tools;

const LAST_KEY = 'ACC_LAST';

class _wallet {
    constructor() {
        this.activeWalletAcc = null;
        this.isLogin = false;
        this.onLoginList = [];
        this.onLogoutList = [];
        this.lastPage = '';    
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
        this.activeWalletAcc = null;
    }

    newActiveAcc(acc) {
        this.clearActiveAccount();
        this.activeWalletAcc = new account(acc);
    }

    create(name, pass, lang = LangList.english) {
        let err = _tools.checkParams({ name, pass }, ['name', 'pass']);
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
        let keystore = _keystore.isValid(data);
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

    restoreAddrs(mnemonic, lang = LangList.english) {
        let num = 10;
        let addrs = _hdAddr.getAddrsFromMnemonic(mnemonic, 0, num, lang);
        if (!addrs) {
            return Promise.reject({
                code: 500005
            });
        }

        let requests = [];
        for (let i=0; i<num; i++) {
            requests.push( $ViteJS.buildinLedger.getBalance(addrs[i].hexAddr) );
        }

        return Promise.all(requests).then((data)=>{
            let index = 0;
            data.forEach((item, i) => {
                if (!item) {
                    return;
                }
                let account = item.balance;
                let onroad = item.onroad;
                if ( (account && +account.totalNumber) || (onroad && +onroad.totalNumber) ) {
                    index = i;
                }
            });

            this.newActiveAcc({
                addrNum: index + 1,
                mnemonic,
                lang,
                type: 'wallet'
            });
            return data;
        });
    }

    restoreAccount(name, pass) {
        if (!this.activeWalletAcc) {
            return Promise.reject();
        }

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
        this.onLogoutList && this.onLogoutList.forEach((cb) => {
            cb && cb();
        });
    }

    login({
        id, entropy, addr
    }, pass) {
        if ( (!entropy && !addr && !id) || !pass ) {
            return Promise.reject(false);
        }
        if (addr && !entropy && !id) {
            return this._loginKeystoreAcc(addr, pass);
        }
        return this._loginWalletAcc({
            id, entropy, pass
        }).then((data) => {
            this.isLogin = true;
            this.onLoginList && this.onLoginList.forEach((cb) => {
                cb && cb();
            });
            return data;
        });
    }

    async _loginKeystoreAcc(addr, pass) {
        let acc = getAccFromAddr(addr);
        let keystore = acc.keystore;

        let before = new Date().getTime();

        const privKey = await _keystore.decrypt(JSON.stringify(keystore), pass, vitecrypto);

        let after = new Date().getTime();
        let n = ( keystore.crypto && keystore.crypto.scryptparams && keystore.crypto.scryptparams.n) ? 
            keystore.crypto.scryptparams.n : 0;
        statistics.event('keystore-decrypt', n, 'time', after - before);

        if (n !== 262144) {
            this.newActiveAcc({
                name: acc.name,
                pass,
                keystore,
                privateKey: privKey,
                type: 'keystore'
            });
            return true;
        }

        // Reduce the difficuly. 262144 to 4096
        let keystoreStr = await _keystore.encryptOldKeystore(privKey, pass, vitecrypto);
        this.newActiveAcc({
            name: acc.name,
            pass,
            keystore: JSON.parse(keystoreStr),
            privateKey: privKey,
            type: 'keystore'
        });
        this.activeWalletAcc.save();

        setLast({
            addr,
            name: acc.name
        });
        return true;
    }

    async _loginWalletAcc({
        id, entropy, pass
    }) {
        let acc;
        let i;

        if (id) {
            acc = getAccFromId(id);
        } else {
            let result = getAccFromEntropy(entropy);
            if (result) {
                acc = result.account;
                i = result.index;
                id = result.id || null;
            }
        }

        let encryptObj = acc.encryptObj;
        entropy = entropy || encryptObj.encryptentropy;
        encryptObj.encryptentropy = encryptObj.encryptentropy || entropy;   // Very very impotant!!!!!
    
        let before = new Date().getTime();
        let decryptEntropy = await _keystore.decrypt(JSON.stringify(encryptObj), pass, vitecrypto);
        let after = new Date().getTime();
        statistics.event('mnemonic-decrypt', encryptObj.version || '1', 'time', after - before);

        if (!decryptEntropy) {
            return false;
        }

        let lang = acc.lang || LangList.english;
        let mnemonic = _hdAddr.getMnemonicFromEntropy(decryptEntropy, lang);
        let defaultInx = +acc.defaultInx > 10 || +acc.defaultInx < 0 ? 0 : +acc.defaultInx;

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

        setLast({
            id,
            entropy,
            name: acc.name
        });
        this.activeWalletAcc.save(acc.name);
        return true;
    }

    getList() {
        return acc.getList();
    }

    getLast() {
        if (this.activeWalletAcc) {
            return {
                id: this.activeWalletAcc.getId(),
                entropy: this.activeWalletAcc.getEntropy(),
                addr: this.activeWalletAcc.type === 'wallet' ? null : this.activeWalletAcc.getDefaultAddr(),
                name: this.activeWalletAcc.name,
            };
        }

        let last = getLast();
        if (!last) {
            return null;
        }

        let acc;
        if (last.addr) {
            acc = getAccFromAddr(last.addr);
        } else if (last.id) {
            acc = getAccFromId(last.id);
        } else {
            let result = getAccFromEntropy(last.entropy);
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


export const wallet = _wallet;

export const reSave = _reSave;



// VCP VV ===>  later
function  _reSave() {
    let list = acc.getList();
    if (!list || !list.length) {
        return;
    }

    let last = getLast();
    let reList = [];
    let isChange = false;

    list.forEach((item) => {
        if (!item) {
            return;
        }

        if (!item.entropy || !item.encryptObj || +item.encryptObj.version !== 1 || !item.encryptObj.scryptParams) {
            reList.push(item);
            return;
        }

        isChange = true;

        let entropy = item.entropy;
        let keystore = _keystore.encryptV1ToV3(entropy, JSON.stringify(item.encryptObj));
        
        keystore = JSON.parse(keystore);

        let mnemonic = _hdAddr.getMnemonicFromEntropy(entropy);
        item.lang = LangList.english;
        item.id = _hdAddr.getId(mnemonic);
        item.encryptObj = keystore;

        if (last && last.entropy && last.entropy === entropy) {
            last.entropy = item.entropy;
        }
        reList.push(item);
    });

    if (!isChange) {
        return;
    }
    
    statistics.event('keystore', 'resave');
    setLast(last);
    acc.setAccList(reList);
}

function getAccFromId(id) {
    let list = acc.getList();
    for(let i=0; i<list.length; i++) {
        if (list[i].id && list[i].id === id) {
            return list[i];
        }
    }
    return null;
}

function getAccFromEntropy(entropy) {
    let result = null;
    let list = acc.getList();
    for(let i=0; i<list.length; i++) {
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
    let list = acc.getList();
    for(let i=0; i<list.length; i++) {
        if (list[i].addr === address) {
            return list[i];
        }
    }
    return null;
}

function getLast() {
    return storage.getItem(LAST_KEY);
}

function setLast(acc) {  
    storage.setItem(LAST_KEY, acc);
}
