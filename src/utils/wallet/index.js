import acc from './storeAcc.js';
import account from './account.js';
import toast from 'components/toast/index.js';
import storage from 'utils/localStorage.js';
import statistics from 'utils/statistics';

import scrypt from './scrypt.js';
console.log(scrypt);

const LAST_KEY = 'ACC_LAST';

class Wallet {
    constructor() {
        this.activeAccount = null;
    }

    getActiveAccount() {
        return this.activeAccount;
    }

    clearActiveAccount() {
        if (!this.activeAccount) {
            return;
        }
        this.activeAccount.lock();
        this.activeAccount = null;
    }

    newActiveAcc(acc) {
        this.clearActiveAccount();
        this.activeAccount = new account(acc);
    }

    create(name, pass) {
        if (!name || !pass) {
            return;
        }

        try {
            let { addr, entropy } = $ViteJS.Wallet.Address.newAddr();
    
            this.newActiveAcc({
                defaultInx: 0,
                addrNum: 1, 
                name,
                decryptEntropy: entropy,
                pass,
                addrs: [addr]
            });
        } catch(err) {
            console.error(err);
            toast( JSON.stringify(err) );
        }
    }

    importKeystore(data) {
        let keystore = $ViteJS.Wallet.Keystore.isValid(data);
        if (!keystore) {
            return false;
        }

        this.newActiveAcc({
            keystore
        });
        this.activeAccount.save();
        return this.activeAccount.getDefaultAddr();
    }

    restoreAddrs(mnemonic) {
        let num = 10;
        let addrs = $ViteJS.Wallet.Address.getAddrsFromMnemonic(mnemonic, num);
        if (!addrs) {
            return Promise.reject({
                code: 500005
            });
        }

        let requests = [];
        for (let i=0; i<num; i++) {
            requests.push( $ViteJS.Vite.Ledger.getBalance(addrs[i].hexAddr) );
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

            let finalAddrs = addrs.slice(0, index+1);
            let entropy = $ViteJS.Wallet.Address.getEntropyFromMnemonic(mnemonic);

            this.newActiveAcc({
                defaultInx: 0,
                addrNum: index + 1,
                decryptEntropy: entropy,
                addrs: finalAddrs
            });
            return data;
        });
    }

    restoreAccount(name, pass) {
        if (!this.activeAccount || !this.activeAccount.decryptEntropy) {
            return;
        }

        return this.activeAccount.encrypt(pass).then(() => {
            this.activeAccount.name = name;
            this.activeAccount.save();
        });
    }

    login({
        id, entropy, addr
    }, pass) {
        if ( (!entropy && !addr) || !pass ) {
            return Promise.reject(false);
        }

        if (addr) {
            let loginRes = this._loginKeystore(addr, pass);
            loginRes && this.activeAccount.unLock();
            return Promise.resolve(loginRes);
        }

        return this._loginWalletAcc({
            id, entropy, pass
        }).then((loginRes) => {
            loginRes && this.activeAccount.unLock();
            return loginRes;
        });
    }

    _loginKeystore(addr, pass) {
        let acc = getAccFromAddr(addr);
        let keystore = acc.keystore;

        let before = new Date().getTime();
        let privKey = $ViteJS.Wallet.Keystore.decrypt(JSON.stringify(keystore), pass);
        if (!privKey) {
            return false;
        }

        // Reduce the difficulty.
        let after = new Date().getTime();
        let n = ( keystore.crypto && keystore.crypto.scryptparams && keystore.crypto.scryptparams.n) ? 
            keystore.crypto.scryptparams.n : 0;
        statistics.event('keystore-decrypt', n, 'time', after - before);

        // 262144 to 4096
        if (n === 262144) {
            let obj = $ViteJS.Vite.Account.newHexAddr(privKey);
            let keystoreStr = $ViteJS.Wallet.Keystore.encrypt(obj, pass);
            keystore = JSON.parse(keystoreStr);
        }

        this.newActiveAcc({
            pass,
            keystore,
            addrs: [{
                hexAddr: addr,
                privKey
            }],
            name: acc.name
        });
        this.activeAccount.save();

        setLast({
            addr,
            name: acc.name
        });
        return true;
    }

    _loginWalletAcc({
        id, entropy, pass
    }) {
        return new Promise((res, rej) => {
            try {
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
    
                let before = new Date().getTime();
                
                $ViteJS.Wallet.Account.decrypt(JSON.stringify(encryptObj), pass).then((decryptEntropy) => {
                    let after = new Date().getTime();
                    statistics.event('mnemonic-decrypt', encryptObj.version || '1', 'time', after - before);
        
                    if (!decryptEntropy) {
                        return false;
                    }
        
                    let mnemonic = $ViteJS.Wallet.Address.getMnemonicFromEntropy(decryptEntropy);
                    let addrs = $ViteJS.Wallet.Address.getAddrsFromMnemonic(mnemonic, acc.addrNum);
                    let defaultInx = +acc.defaultInx > 10 || +acc.defaultInx < 0 ? 0 : +acc.defaultInx;
        
                    this.newActiveAcc({
                        pass,
                        entropy, defaultInx, addrs, decryptEntropy,
                        encryptObj: acc.encryptObj, 
                        addrNum: acc.addrNum, 
                        name: acc.name
                    });
        
                    if (entropy && !id) {
                        statistics.event('keystore', 'resave-id');
                        this.activeAccount.save(i);
                    }
        
                    setLast({
                        id,
                        entropy,
                        name: acc.name
                    });
                    return res(true);
                }).catch((err) => {
                    return rej(err);
                });
            } catch(err) {
                console.warn(err);
                return rej(false);
            }
        });
    }

    getLast() {
        if (this.activeAccount) {
            return {
                entropy: this.activeAccount.entropy,
                addr: this.activeAccount.isWalletAcc ? null : this.activeAccount.getDefaultAddr(),
                name: this.activeAccount.name,
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

    getList() {
        return acc.getList();
    }

    // VCP VV ===>  later
    reSave() {
        let list = acc.getList();
        if (!list || !list.length) {
            return;
        }
    
        let last = getLast();
        let reList = [];
        let pList = [];
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
            let scryptP = {
                scryptParams: item.encryptObj.scryptParams,
                encryptPwd: item.encryptObj.encryptP
            };
            let entropy = item.entropy;
            pList.push( $ViteJS.Wallet.Account.encrypt(entropy, null, scryptP).then((encryptObj) => {
                let obj = JSON.parse(encryptObj);
                item.entropy = obj.encryptentropy;
                item.encryptObj = {
                    crypto: obj.crypto,
                    version: obj.version,
                    timestamp: obj.timestamp
                };
        
                if (last && last.entropy && last.entropy === entropy) {
                    last.entropy = item.entropy;
                }
                reList.push(item);
            }) );
        });
    
        if (!isChange) {
            return;
        }
        
        Promise.all(pList).then(() => {
            statistics.event('keystore', 'resave');
            setLast(last);
            acc.setAccList(reList);
        });
    }
}

export default  new Wallet();

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
