import { utils } from '@vite/vitejs';

import acc from './storeAcc.js';
import account from './account.js';
import toast from 'components/toast/index.js';
import storage from 'utils/localStorage.js';
import statistics from 'utils/statistics';
import { encoder } from 'utils/tools';
import vitecrypto from 'testwebworker';

const _keystore = utils.keystore;
const _hdAddr = utils.address.hdAddr;


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
            let { addr, entropy } = _hdAddr.newAddr();
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
        let keystore = _keystore.isValid(data);
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
        let addrs = _hdAddr.getAddrsFromMnemonic(mnemonic, 0, num);
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

            let finalAddrs = addrs.slice(0, index+1);
            let entropy = _hdAddr.getEntropyFromMnemonic(mnemonic);

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
            return Promise.reject();
        }

        return this.activeAccount.encrypt(pass).then(() => {
            this.activeAccount.name = name;
            this.activeAccount.save();
        });
    }

    login({
        id, entropy, addr
    }, pass) {
        if ( (!entropy && !addr && !id) || !pass ) {
            return Promise.reject(false);
        }
        if (addr) {
            return this._loginKeystore(addr, pass);
        }
        return this._loginWalletAcc({
            id, entropy, pass
        });
    }

    _loginKeystore(addr, pass) {
        let acc = getAccFromAddr(addr);
        let keystore = acc.keystore;

        return new Promise((res, rej) => {
            let before = new Date().getTime();
            _keystore.decrypt(JSON.stringify(keystore), pass, vitecrypto).then((privKey) => {
                let after = new Date().getTime();
                let n = ( keystore.crypto && keystore.crypto.scryptparams && keystore.crypto.scryptparams.n) ? 
                    keystore.crypto.scryptparams.n : 0;
                statistics.event('keystore-decrypt', n, 'time', after - before);
    
                if (n !== 262144) {
                    this.newActiveAcc({
                        pass,
                        keystore,
                        addrs: [{
                            hexAddr: addr,
                            privKey
                        }],
                        name: acc.name
                    });
                    return res(true);
                }

                // Reduce the difficuly. 262144 to 4096
                _keystore.encryptOldKeystore(privKey, pass, vitecrypto).then((keystoreStr) => {
                    keystore = JSON.parse(keystoreStr);
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
                    return res(true);
                }).catch((err) => {
                    return rej(err);
                });
            }).catch((err) => {
                rej(err);
            });
        });
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
                encryptObj.encryptentropy = encryptObj.encryptentropy || entropy;   // Very very impotant!!!!!
    
                let before = new Date().getTime();
                _keystore.decrypt(JSON.stringify(encryptObj), pass, vitecrypto).then((decryptEntropy) => {
                    let after = new Date().getTime();
                    statistics.event('mnemonic-decrypt', encryptObj.version || '1', 'time', after - before);
        
                    if (!decryptEntropy) {
                        return false;
                    }
        
                    let mnemonic = _hdAddr.getMnemonicFromEntropy(decryptEntropy);
                    let addrs = _hdAddr.getAddrsFromMnemonic(mnemonic, 0, acc.addrNum);
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
                    console.warn(err);
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
                id: this.activeAccount.id,
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
            let addr = _hdAddr.getAddrFromMnemonic(mnemonic, 0);

            item.id = getHexId(addr.hexAddr);
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
}

export default new Wallet();

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

function getHexId(key) {
    let keyByte = encoder.utf8ToBytes(key);
    let idByte = encoder.blake2b(keyByte, null, 32);
    let idHex = encoder.bytesToHex(idByte);
    return idHex;
}
