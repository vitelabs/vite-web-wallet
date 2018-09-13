import acc from './store/acc.js';
import lastIn from './store/lastIn';

const path = 'm/44\'/999\'';
const namePre = 'account';

class Wallet {
    constructor() {

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

    saveAcc({
        name, entropy, addr, pass, keystore
    }) {
        name = this._checkName(name);

        if (keystore) {
            let item = {
                name,
                addr: keystore.hexaddress,
                keystore
            };
            acc.add(item);
            return item;
        }

        let defaultPath = `${path}/0\'`;
        let addrList = {};
        addrList[defaultPath] = {
            addr: addr.hexAddr,
            privKey: addr.privKey
        };
        let item = {
            pass,
            name,
            entropy,
            defaultPath,
            addrList
        };
        acc.add(item);
        return item;
    }

    create(name, pass) {
        let { addr, entropy } = $ViteJS.Wallet.Address.newAddr(path);
        this.saveAcc({
            name, entropy, addr, pass
        });
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

        if (last.addr) {
            return this.getAccFromAddr(last.addr);
        }

        return this.getAccFromEntropy(last.entropy);
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