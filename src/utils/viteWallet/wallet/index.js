import acc from '../store/acc.js';
import lastIn from '../store/lastIn.js';
import account from './account.js';

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

        let { addr, entropy } = $ViteJS.Wallet.Address.newAddr();
        let encryptObj = $ViteJS.Wallet.Account.encrypt(pass);
        this.newActiveAcc({
            defaultInx: 0,
            addrNum: 1, 
            name,
            entropy,
            encryptObj,
            addrs: [addr]
        });
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
            return Promise.reject(addrs);
        }

        let requests = [];
        for (let i=0; i<num; i++) {
            requests.push({
                type: 'request',
                methodName: 'ledger_getAccountByAccAddr',
                params: [ addrs[i].hexAddr ]
            });
        }

        return $ViteJS.Vite._currentProvider.batch(requests).then((data) => {
            let index = 0;
            data.forEach(({ result }, i) => {
                if (!result) {
                    return;
                }
                result.blockHeight && (index = i);
            });

            let finalAddrs = addrs.slice(0, index+1);
            let entropy = $ViteJS.Wallet.Address.getEntropyFromMnemonic(mnemonic);
            this.newActiveAcc({
                defaultInx: 0,
                addrNum: index + 1,
                entropy,
                addrs: finalAddrs
            });
            return data;
        });
    }

    restoreAccount(name, pass) {
        if (!this.activeAccount) {
            return;
        }
        let encryptObj = $ViteJS.Wallet.Account.encrypt(pass);
        this.activeAccount.name = name;
        this.activeAccount.encryptObj = encryptObj;
        this.activeAccount.save();
    }

    login({
        entropy, addr
    }, pass) {
        if ( (!entropy && !addr) || !pass ) {
            return false;
        }

        let loginRes = addr ? this._loginKeystore(addr, pass) : this._loginWalletAcc(entropy, pass);
        if (!loginRes) {
            return false;
        }

        this.activeAccount.unLock();
        return true;
    }

    _loginKeystore(addr, pass) {
        let acc = this.getAccFromAddr(addr);
        let keystore = acc.keystore;
        let privKey = $ViteJS.Wallet.Keystore.decrypt(JSON.stringify(keystore), pass);
        if (!privKey) {
            return false;
        }

        this.newActiveAcc({
            keystore,
            addrs: [{
                hexAddr: addr,
                privKey
            }],
            name: acc.name
        });
        setLast({
            addr,
            name: acc.name
        });
        return true;
    }

    _loginWalletAcc(entropy, pass) {
        try {
            let acc = this.getAccFromEntropy(entropy);
            let verifyRes = $ViteJS.Wallet.Account.verify(acc.encryptObj, pass);
            if (!verifyRes) {
                return false;
            }

            let mnemonic = $ViteJS.Wallet.Address.getMnemonicFromEntropy(acc.entropy);
            let addrs = $ViteJS.Wallet.Address.getAddrsFromMnemonic(mnemonic, acc.addrNum);
            let defaultInx = +acc.defaultInx > 10 || +acc.defaultInx < 0 ? 0 : +acc.defaultInx;

            this.newActiveAcc({
                entropy, defaultInx, addrs, 
                encryptObj: acc.encryptObj, 
                addrNum: acc.addrNum, 
                name: acc.name
            });

            setLast({
                entropy,
                name: acc.name
            });
        } catch(err) {
            console.warn(err);
            return false;
        }
        return true;
    }

    getLast() {
        if (this.activeAccount) {
            return {
                entropy: this.activeAccount.entropy,
                addr: this.activeAccount.isWalletAcc ? null : this.activeAccount.getDefaultAddr(),
                name: this.activeAccount.name,
            };
        }

        let last = lastIn.getLast();
        if (!last) {
            return null;
        }

        let acc = last.addr ? this.getAccFromAddr(last.addr) : this.getAccFromEntropy(last.entropy);
        if (!acc) {
            return null;
        }
        
        return acc;
    }

    getAccFromEntropy(entropy) {
        let list = acc.getList();
        for(let i=0; i<list.length; i++) {
            if (list[i].entropy === entropy) {
                return list[i];
            }
        }
        return null;
    }

    getAccFromAddr(address) {
        let list = acc.getList();
        for(let i=0; i<list.length; i++) {
            if (list[i].addr === address) {
                return list[i];
            }
        }
        return null;
    }

    getList() {
        return acc.getList();
    }
}

export default Wallet;

function setLast({ entropy, addr, name }) {
    lastIn.setLast({ entropy, addr, name });
}
