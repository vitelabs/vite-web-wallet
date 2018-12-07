import { utils } from '@vite/vitejs';
import vitecrypto from 'testwebworker';

import config from 'config/constant';
import { pwdConfirm } from 'components/password/index.js';
import { getPowNonce } from 'services/pow';
import { encoder } from 'utils/tools';
import acc from './storeAcc.js';

const _keystore = utils.keystore;
const _hdAddr = utils.address.hdAddr;

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

        if (this.addrs && this.addrs.length) {
            this.id = getHexId(this.addrs[0].hexAddr);
        } else if (this.decryptEntropy) {
            let mnemonic = _hdAddr.getMnemonicFromEntropy(this.decryptEntropy);
            let addr = _hdAddr.getAddrFromMnemonic(mnemonic, 0);
            this.addrs = [addr];
            this.id = getHexId(addr.hexAddr);
        }
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
        cancelTxt = '',
        exchange=false
    }, isConfirm = false) {
        let isHide = !isConfirm && this.isHoldPWD;

        if (isHide) {
            submit && submit();
            return true;
        }

        pwdConfirm({
            showMask, title, submit, content, cancel, cancelTxt, submitTxt,exchange
        }, !this.isHoldPWD);
        return false;
    }

    verify(pass) {
        if (this.pass) {
            return Promise.resolve(this.pass === pass);
        }

        if (this.isWalletAcc) {
            return !this.encryptObj ? 
                Promise.resolve(false) : 
                _keystore.decrypt(JSON.stringify(this.encryptObj), pass, vitecrypto);
        }

        if (!this.keystore) {
            return Promise.resolve(false);
        }
        
        return _keystore.decrypt(JSON.stringify(this.keystore), pass, vitecrypto);
    }

    encrypt(pass) {
        if (!this.decryptEntropy || (!this.pass && !pass)) {
            return Promise.reject(false);
        }

        pass && (this.pass = pass);
        return _keystore.encrypt(this.decryptEntropy, this.pass, null, vitecrypto).then((encryptObj) => {
            let obj = JSON.parse(encryptObj);
            this.encryptObj = obj;
            return encryptObj;
        });
    }
    save(index = -1) {
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
            id: this.id || getHexId(this.addrs[0].hexAddr),
            defaultInx: this.defaultInx, 
            addrNum: this.addrs.length, 
            name: this.name, 
            entropy: this.entropy,
            encryptObj: this.encryptObj
        }, index);
    }
    changeMnemonic(len) {
        let bits = len === 12 ? 128 : 256;
        let { addr, entropy } = _hdAddr.newAddr(bits);
        this.decryptEntropy = entropy;
        this.addrs = [addr];
        this.defaultInx = 0;
        this.addrNum = 1;
    }
    getMnemonic() {
        if (!this.decryptEntropy) {
            return null;
        }
        return _hdAddr.getMnemonicFromEntropy(this.decryptEntropy);
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
        let addr = _hdAddr.getAddrFromMnemonic(this.getMnemonic(), index);

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

        $ViteJS.autoReceiveTX(addr, privKey, async (err, accountBlock) => {
            if (!err || !err.error || !err.error.code || err.error.code !== -35002) {
                return Promise.reject(err);
            }

            let data = await getPowNonce(addr, accountBlock.prevHash);
            accountBlock.difficulty = data.difficulty;
            accountBlock.nonce = data.nonce;

            return this.sendRawTx(accountBlock, privKey);
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

        $ViteJS.stopAutoReceiveTX(addr.hexAddr);
    }

    sendRawTx(block, privKey) {
        privKey = privKey || this.addrs[this.defaultInx].privKey;
        return $ViteJS.sendRawTx(block, privKey);
    }

    async getBlock({
        toAddr, tokenId, amount, message, nodeName, producerAddr, rewardAddress, difficulty
    }, type = 'sendBlock', isPow = false) {
        let types = {
            receiveBlock: 'asyncReceiveTx',
            sendBlock: 'asyncSendTx',
            cancelPledgeBlock: 'withdrawalOfQuota',
            pledgeBlock: 'getQuota',
            updateRegisterBlock: 'updateReg',
            rewardBlock: 'retrieveReward',
            registerBlock: 'SBPreg',
            cancelRegisterBlock: 'revokeReg',
            cancelVoteBlock: 'revokeVoting',
            voteBlock: 'voting'
        };

        let accountAddress = this.addrs[this.defaultInx].hexAddr;
        let toAddress = toAddr || producerAddr || rewardAddress;
        
        let block = await $ViteJS.buildinTxBlock[types[type]]({
            accountAddress, 
            toAddress, 
            Gid: config.gid,
            tokenId, amount, message, 
            nodeName
        });

        if (!isPow) {
            return block;
        }
        
        let data = await getPowNonce(accountAddress, block.prevHash, difficulty);
        block.difficulty = data.difficulty;
        block.nonce = data.nonce;

        return block;
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
        return $ViteJS.buildinLedger.getBalance(addr);
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

function getHexId(key) {
    let keyByte = encoder.utf8ToBytes(key);
    let idByte = encoder.blake2b(keyByte, null, 32);
    let idHex = encoder.bytesToHex(idByte);
    return idHex;
}
