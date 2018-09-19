import acc from '../store/acc.js';
import lastIn from '../store/lastIn.js';
import account from './account.js';

const path = 'm/44\'/999\'';
const namePre = 'account';

class Wallet {
    constructor() {
        this.account = account;
        this.rootPath = path;
        this.defaultAccount=null;
    }

    getAccInstance({
        entropy, addr
    }) {
        return new this.account({
            entropy, addr, wallet: this
        });
    }
    _checkName(name) {
        if (name) {
            return name;
        }
        let count = acc.getNameCount();
        name = `${namePre}${count}`;
        acc.setNameCount(count + 1);
        return name;
    }

    saveAcc(account) {
        let name = this._checkName(account.name);

        if (account.keystore) {
            let item = {
                name,
                addr: account.keystore.hexaddress,
                keystore: account.keystore
            };
            acc.add(item);
            return item;
        }

        acc.add(account);
        return account;
    }

    create(name, pass) {
        let { addr, entropy } = $ViteJS.Wallet.Address.newAddr(path);
        let defaultPath = `${path}/0\'`;
        let addrList = {};
        addrList[defaultPath] = {
            addr: addr.hexAddr,
            privKey: addr.privKey
        };

        let acc = {
            name, pass, defaultPath, entropy, addrList
        };

        this.saveAcc(acc);
        return { addr, entropy };
    }

    setLast(account) {
        if (!account) {
            return;
        }
        
        let acc = {
            entropy: account.entropy || '',
            addr: account.addr || ''
        };
        lastIn.setLast(acc);
    }

    getLast() {
        let last = lastIn.getLast();
        if (!last) {
            return null;
        }

        let acc = last.addr ? this.getAccFromAddr(last.addr) : this.getAccFromEntropy(last.entropy);
        if (!acc) {
            return null;
        }
        
        return this.getAccInstance(acc);
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

    isValidKeystore(data) {
        try {
            return $ViteJS.Wallet.Keystore.isValid(data);
        } catch(err) {
            console.warn(err);
            return false;
        }
    }

    getAddrsFromMnemonic(mnemonic) {
        let addrs = $ViteJS.Wallet.Address.getAddrsFromMnemonic(mnemonic, path);
        if (!addrs) {
            return Promise.reject(addrs);
        }
        console.log(addrs);
    }

    rename(account, name) {
        if (!account || !name || !account.entropy || !account.addr) {
            return false;
        }

        let list = acc.getList();
        let i;
        for(i=0; i<list.length; i++) {
            if (account.entropy && account.entropy === list[i].entropy) {
                break;
            }
            if (account.addr && account.addr === list[i].addr) {
                break;
            }
        }

        if (i >= list.length) {
            return false;
        }

        list[i].name = name;
        acc.setAccList(list);
        return true;
    }
}

export default Wallet;