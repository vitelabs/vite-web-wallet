class Account {
    constructor({
        entropy, addr, wallet
    }) {
        this.wallet = wallet;
        this.isWalletAcc = !addr;

        this.entropy = entropy;
        this.addr = addr;
    }

    _getSelf() {
        if (this.entropy) {
            return this.wallet.getAccFromEntropy(this.entropy);
        }
        if (this.addr) {
            return this.wallet.getAccFromAddr(this.addr);
        }
        return null;
    }

    getName() {
        let self = this._getSelf();
        return self ? self.name : '';
    }

    getAddrList() {
        let self = this._getSelf();

        if (!self) {
            return [];
        }

        if (!this.isWalletAcc) {
            return [{
                path: '',
                addr: self.addr
            }];
        }

        let list = [];
        for (let path in self.addrList) {
            let item = self.addrList[path];
            list.push({
                path,
                addr: item.addr
            });
        }
        return list;
    }

    getDefaultAddr() {
        let self = this._getSelf();
        if (!self) {
            return null;
        }

        if (!this.isWalletAcc) {
            return self.addr || '';
        }

        try {
            return self.addrList[ self.defaultPath ].addr;
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    getMnemonic() {
        if (!this.isWalletAcc) {
            return null;
        }

        let self = this._getSelf();
        if (!self) {
            return;
        }
    
        let entropy = self.entropy || null;
        if (!entropy) {
            return;
        }

        return $ViteJS.Wallet.Address.getMnemonicFromEntropy(entropy);
    }

    setDefault(path) {
        if (!this.isWalletAcc) {
            return;
        }

        let self = this._getSelf();
        if (!self.addrList || !self.addrList[path]) {
            return;
        }

        self.defaultPath = path;
        this.wallet.saveAcc(self);
    }

    addAddr() {
        if (!this.isWalletAcc) {
            return;
        }

        let addrList = this.getAddrList();
        if (!addrList || !addrList.length || addrList.length >= 10) {
            return;
        }

        let path = `${this.wallet.rootPath }/${addrList.length}\'`;
        let mnenonic = this.getMnemonic();
        if (!mnenonic) {
            return;
        }

        let addr = $ViteJS.Wallet.Address.newAddrFromMnemonic(mnenonic, path);
        let self = this._getSelf();
        if (!self) {
            return;
        }

        self.addrList[path] = {
            addr: addr.hexAddr,
            privKey: addr.privKey
        };
        this.wallet.saveAcc(self);
    }
}

export default Account;