const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const eth = require('web3-eth');
const ethProvider = require('web3-providers-http');

const hdPathString = 'm/44\'/60\'/0\'/0';
const gas = 60000;

// const tx = require('ethereumjs-tx');
// console.log(tx);

class ethWallet {
    constructor({
        mnemonic
    }) {
        let provider = new ethProvider('http://localhost:8415');
        this.web3 = new eth(provider);

        this.defaultAddrInx = 0;
        this.addrs = [];

        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let hdWallet = hdkey.fromMasterSeed(seed);
        this.root = hdWallet.derivePath(hdPathString);
        this.addAddr();

        this.getBalance();
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

    replaceVite(Gwei) {
        let g = Gwei * gas;
        console.log(g);
    }

    sendTx() {

    }

    getBalance() {
        console.log(this.addrs[this.defaultAddrInx].wallet);
        let defaultAddr = this.addrs[this.defaultAddrInx].hexAddr;
        return this.web3.getBalance(defaultAddr);
    }
}

export default ethWallet;
