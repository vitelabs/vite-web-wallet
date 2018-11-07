import acc from './storeAcc.js';
import { pwdConfirm } from 'components/password/index.js';
import config from 'config/constant';

const namePre = 'account';
let passTimeout;

class Account {
    constructor({
        entropy, encryptObj, addrNum, defaultInx, addrs, name, keystore, pass, decryptEntropy
    }) {
        this.isWalletAcc = !keystore;
        this.name = checkName(name);
        this.isHoldPWD = false;

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
    
    holdPWD(pwd, time) {
        this.pass = pwd;
        this.isHoldPWD = true;
        passTimeout = setTimeout(() => {
            this.releasePWD();
        }, time);
    }

    releasePWD() {
        passTimeout && clearTimeout(passTimeout);
        passTimeout = null;
        this.isHoldPWD = false;
        window.isShowPWD = false;
    }

    initPwd({
        showMask = true,
        title,
        submit = () => {},
        cancel = () => {},
        content = '',
        submitTxt = '',
        cancelTxt = ''
    }, isConfirm = false) {
        let isHide = !isConfirm && this.isHoldPWD;

        if (isHide) {
            submit && submit();
            return true;
        }

        pwdConfirm({
            showMask, title, submit, content, cancel, cancelTxt, submitTxt
        }, !this.isHoldPWD);
        return false;
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

        $ViteJS.Wallet.Account.autoReceiveTX(addr, privKey, (err, accountBlock, res, rej) => {
            if (!err || !err.error || !err.error.code || err.error.code !== -35002) {
                return rej(err);
            }

            viteWallet.Pow.getNonce(addr, accountBlock.prevHash).then((data) => {
                accountBlock.difficulty = data.difficulty;
                accountBlock.nonce = data.nonce;

                this.sendRawTx(accountBlock, privKey).then((data) => {
                    return res(data);
                }).catch((err) => {
                    return rej(err);
                });

            }).catch((err) => {
                rej(err);
            });
        });
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

    sendRawTx(block, privKey) {
        privKey = privKey || this.addrs[this.defaultInx].privKey;
        return $ViteJS.Wallet.Account.sendRawTx(block, privKey);
    }

    getBlock({
        toAddr, tokenId, amount, message, nodeName, producerAddr, rewardAddress
    }, type = 'sendBlock', isPow = false) {
        return new Promise((res, rej) => {
            let accountAddress = this.addrs[this.defaultInx].hexAddr;
            
            return $ViteJS.Vite.Ledger[type]({
                accountAddress, 
                toAddress: toAddr, 
                Gid: config.gid,
                tokenId, amount, message, 
                nodeName, producerAddr, rewardAddress
            }).then((block)=>{
                if (!isPow) {
                    return res(block);
                }

                viteWallet.Pow.getNonce(accountAddress, block.prevHash).then((data) => {
                    block.difficulty = data.difficulty;
                    block.nonce = data.nonce;
                    return res(block);
                }).catch((err) => {
                    rej(err);
                });
            }).catch((err)=>{
                return rej(err);
            });
        });
    }

    sendTx({
        toAddr, tokenId, amount, message, nodeName, producerAddr, rewardAddress
    }, type = 'sendBlock') {
        // First tx
        window.isShowPWD = true;

        let privKey = this.addrs[this.defaultInx].privKey;

        return new Promise((res, rej) => {
            this.getBlock({
                toAddr, tokenId, amount, message, nodeName, producerAddr, rewardAddress
            }, type).then((block) => {
                this.sendRawTx(block, privKey).then((data) => {
                    return res(data);
                }).catch(err => {
                    return rej(err);
                });
            }).catch(err => {
                return rej(err);
            });
        });
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
