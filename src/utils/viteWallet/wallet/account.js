import acc from './storeAcc.js';

const namePre = 'account';

class Account {
    constructor({
        entropy, encryptObj, addrNum, defaultInx, addrs, name, keystore, pass, decryptEntropy
    }) {
        this.isWalletAcc = !keystore;
        this.name = checkName(name);

        // Keystore account
        this.keystore = keystore;
        this.pass = pass;

        // Wallet account
        this.decryptEntropy = decryptEntropy;
        this.entropy = entropy;
        this.encryptObj = encryptObj;

        this.defaultInx = !this.isWalletAcc ? 0 : defaultInx || 0;
        this.addrNum = !this.isWalletAcc ? 1 : addrNum;
        this.addrs = (!this.isWalletAcc && !addrs) ? [{
            hexAddr: keystore.hexaddress
        }] : addrs;
    }

    verify(pass) {
        if (this.pass) {
            return this.pass === pass;
        }

        if (this.isWalletAcc) {
            return !this.encryptObj ? false : $ViteJS.Wallet.Account.verify(this.encryptObj, pass);
        }

        if (!this.keystore) {
            return false;
        }
        
        return $ViteJS.Wallet.Keystore.decrypt(JSON.stringify(this.keystore), pass);
    }

    save() {
        this.name = checkName(this.name);

        if (!this.isWalletAcc) {
            let item = {
                name: this.name,
                addr: this.keystore.hexaddress,
                keystore: this.keystore
            };
            acc.add(item);
            return;
        }

        acc.add({
            defaultInx: this.defaultInx, 
            addrNum: this.addrs.length, 
            name: this.name, 
            entropy: this.entropy,
            encryptObj: this.encryptObj
        });
    }

    getMnemonic() {
        if (!this.decryptEntropy) {
            return null;
        }
        return $ViteJS.Wallet.Address.getMnemonicFromEntropy(this.decryptEntropy);
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
        if (!this.isWalletAcc || this.addrs.length >= 10) {
            return;
        }
        
        let index = this.addrs.length;
        let addr = $ViteJS.Wallet.Address.newAddrFromMnemonic(this.getMnemonic(), index);

        this.addrs.push(addr);
        this.addrNum = this.addrs.length;
        this.save();
    }

    getAddrList() {
        let addrs = [];
        this.addrs.forEach(({ hexAddr }) => {
            addrs.push(hexAddr);
        });
        return addrs;
    }

    setDefaultAddr(addr) {
        if (!this.isWalletAcc) {
            return true;
        }

        let i;
        for(i=0; i<this.addrs.length; i++) {
            if (this.addrs[i].hexAddr === addr) {
                break;
            }
        }

        if (i >= this.addrs.length) {
            return false;
        }

        this.lock();    // Lock current default address
        this.defaultInx = i;    // Change default address
        this.save();    // Save default
        this.unLock();  // Unlock the current default address
        return true;
    }

    getDefaultAddr() {
        return this.addrs[this.defaultInx].hexAddr;
    }

    unLock() {
        if (!this.addrs || !this.addrs.length) {
            return;
        }

        let addr = this.addrs[this.defaultInx].hexAddr;
        let privKey = this.addrs[this.defaultInx].privKey;
        $ViteJS.Wallet.Account.autoReceiveTX(addr, privKey);
    }

    lock() {
        if (!this.addrs || !this.addrs.length) {
            return;
        }

        let addr = this.addrs[this.defaultInx];
        if (!addr) {
            return;
        }

        $ViteJS.Wallet.Account.stopAutoReceiveTX(addr.hexAddr);
    }

    sendTx({
        toAddr, pass, tokenId, amount, message
    }) {
        let verifyRes = this.verify(pass);
        if (!verifyRes) {
            return Promise.reject({
                code: -34001,
                message: 'passErr'
            });
        }

        let fromAddr = this.addrs[this.defaultInx].hexAddr;
        let privKey = this.addrs[this.defaultInx].privKey;

        return $ViteJS.Wallet.Account.sendTx({
            fromAddr, toAddr, tokenId, amount, message
        }, privKey);
    }

    getBalance() {
        let addr = this.getDefaultAddr();
        return $ViteJS.Vite.Ledger.getBalance(addr);
    }
}

export default Account;

function checkName(name) {
    if (name) {
        return name;
    }
    let count = acc.getNameCount();
    name = `${namePre}${count}`;
    acc.setNameCount(count + 1);
    return name;
}
