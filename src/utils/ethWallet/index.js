const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

const hdPathString = 'm/44\'/60\'/0\'/0';

// var Account = require('eth-lib/lib/account');
// console.log(Account);

// console.log(hdkey);

// const tx = require('ethereumjs-tx');
// console.log(tx);

class ethWallet {
    constructor({
        mnemonic
    }) {
        this.defaultAddrInx = 0;
        this.addrs = [];

        this.mnemonic = mnemonic;

        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let hdWallet = hdkey.fromMasterSeed(seed);
        this.root = hdWallet.derivePath(hdPathString);
        this.addAddr();
    }

    addAddr() {
        let index = this.addrs.length;
        let child = this.root.deriveChild(index);
        let wallet = child.getWallet();
        let addr = '0x' + wallet.getAddress().toString('hex');
        this.addrs.push({
            hexAddr: addr,
            wallet
        });

        return addr;
    }

    sendTx() {

    }

    getBalance() {
        console.log(this.addrs[this.defaultAddrInx].wallet);
    }
}

export default ethWallet;
