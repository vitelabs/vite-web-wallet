import acc from '../store/acc.js';

const namePre = 'account';

class Account {
    constructor({
        entropy, encryptObj, addrNum, defaultInx, addrs, name, keystore
    }) {
        this.isWalletAcc = !keystore;
        this.name = checkName(name);

        // Keystore account
        this.keystore = keystore;

        // Wallet account
        this.entropy = entropy;
        this.encryptObj = encryptObj;

        this.defaultInx = !this.isWalletAcc ? 0 : defaultInx || 0;
        this.addrNum = !this.isWalletAcc ? 1 : addrNum;
        this.addrs = (!this.isWalletAcc && !addrs) ? [{
            hexAddr: keystore.hexaddress
        }] : addrs;
    }

    verify(pass) {
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
        return $ViteJS.Wallet.Address.getMnemonicFromEntropy(this.entropy);
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
            return;
        }

        let i;
        for(i=0; i<this.addrs.length; i++) {
            if (this.addrs[i].hexAddr === addr) {
                break;
            }
        }

        if (i >= this.addrs.length) {
            return;
        }

        this.defaultInx = i;
        this.save();
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
        $ViteJS.Wallet.Account.unlock(addr, privKey);
    }

    lock() {
        if (!this.addrs || !this.addrs.length) {
            return;
        }

        let addr = this.addrs[this.defaultInx];
        if (!addr) {
            return;
        }

        $ViteJS.Wallet.Account.lock(addr.hexAddr);
    }

    sendTx({
        toAddr, pass, tokenId, amount
    }) {
        let verifyRes = this.verify(pass);
        if (!verifyRes) {
            return Promise.reject('passErr');
        }

        let fromAddr = this.addrs[this.defaultInx].hexAddr;
        let privKey = this.addrs[this.defaultInx].privKey;

        console.log(fromAddr);
        console.log(privKey);

        return $ViteJS.Wallet.Account.sendTx({
            fromAddr, toAddr, tokenId, amount
        }, privKey);
    }

    getBalance() {
        let addr = this.getDefaultAddr();
        return $ViteJS.Vite._currentProvider.batch([{
            type: 'request',
            methodName: 'ledger_getAccountByAccAddr',
            params: [ addr ]
        },{
            type: 'request',
            methodName: 'ledger_getUnconfirmedInfo',
            params: [ addr ]
        }]).then((data)=>{
            if (!data || !data.length) {
                return null;
            }

            let result = {
                balance: data[0].result, 
                unconfirm: data[1].result
            };
            return result;
        });
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
