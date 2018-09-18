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

    unLock(pass) {
        if (!this.isWalletAcc) {
            let keystore = this._getSelf().keystore;
            // let keyJSON = {'hexaddress':'vite_5f03e33f9550155548bf0a045a7a602384d3f1a65fb2ceff6b','id':'71b3bd76-a938-403d-b876-57ca22f993f3','crypto':{'ciphername':'aes-256-gcm','ciphertext':'03d8f2773ddce6132a5ceb136ba736ae1640ba2d664f2a8493a2f3ff2bb84dec8a3229edad6031a7ef494946852d3e3a45b0b3a88eb3167b41a3843d01d93c9abe52479f582b694e9c378dfb5aac7eb5','nonce':'a6bb299c35e48960e096351d','kdf':'scrypt','scryptparams':{'n':262144,'r':8,'p':1,'keylen':32,'salt':'a35724d6c46cb59e47c893a2bba3875c5b238c8a9ce9b2b1b3c4c0f6dec618db'}},'keystoreversion':1,'timestamp':1536059534};
            
            let privKey = $ViteJS.Wallet.Keystore.decrypt(JSON.stringify(keystore), pass);

            if (!privKey) {
                return false;
            }
            $ViteJS.Wallet.Account.unlock(this.addr, privKey);
            return true;
        }

        let privKey = this._getSelf().privKey;
        $ViteJS.Wallet.Account.unlock(this.addr, privKey);
        return true;
    }

    lock() {
        $ViteJS.Wallet.Account.lock(this.getDefaultAddr());
    }
}

export default Account;
