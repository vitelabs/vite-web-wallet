const web3Eth = require('web3-eth');
const utils = require('web3-utils');
const Tx = require('ethereumjs-tx');
const ethProvider = require('web3-providers-http'); // Web3-providers-ws cannot work in IE.

// import { bind as gwBind, balance as gwBalance } from 'services/exchangeVite';
import { bind as gwBind } from 'services/exchangeVite';
import { timer } from 'utils/asyncFlow';
import address from './address';
import { viteContractAbi, viteContractAddr, blackHole, signBinding } from './viteContract';

const balanceTime = 2000;
let provider = null;

class ethWallet {
    constructor({
        mnemonic
    }) {
        this.utils = utils;
        this.mnemonic = mnemonic;

        this.defaultAddrInx = 0;
        this.addrs = [];
        this.addAddr();

        provider = provider || new ethProvider(process.env.ethServer);
        this.web3 = new web3Eth(provider);

        this.contract = new this.web3.Contract(viteContractAbi, viteContractAddr);
        this.tokenList = {
            vite: {
                name: 'vite',
                symbol: 'VITE',
                decimals: 18,
                balance: 0
            },
            eth: {
                name: 'eth',
                symbol: 'ETH',
                decimals: utils.unitMap.ether.length - 1, // 18
                balance: 0,
            }
        };
        this._initVite();

        this.balanceInfoInst = null;
        this.viteBalanceInfoInst = null;
        this._loopBalance();
    }

    destroyed() {
        this._stopLoopBalance();
    }

    _initVite() {
        let _this = this;
        this.contract.methods.decimals().call({
            from: this.getDefaultAddr()
        }, function(error, result) {
            !error && (_this.viteDecimals = result);
        });
        this.contract.methods.symbol().call({
            from: this.getDefaultAddr()
        }, function(error, result){
            !error && (_this.tokenList.vite.symbol = result);
        });
    }
    _loopBalance() {
        this._stopLoopBalance();

        this.getEthBalance();
        this.balanceInfoInst = new timer(()=>{
            return this.getEthBalance();
        }, balanceTime);
        this.balanceInfoInst.start();

        this.getViteBalance();
        this.viteBalanceInfoInst = new timer(()=>{
            return this.getViteBalance();
        }, balanceTime);
        this.viteBalanceInfoInst.start();
    }
    _stopLoopBalance() {
        this.balanceInfoInst && this.balanceInfoInst.stop();
        this.balanceInfoInst = null;
        this.viteBalanceInfoInst && this.viteBalanceInfoInst.stop();
        this.viteBalanceInfoInst = null;
    }

    getViteBalance() {
        // return gwBalance({
        //     address: this.getDefaultAddr()
        // }).then((data) => {
        //     this.tokenList.vite.balance = data && data.VITE ? data.VITE.Balance || 0 : 0;
        // });

        return new Promise((res, rej) => {
            let _this = this;
            this.contract.methods.balanceOf(this.getDefaultAddr()).call({
                from: this.getDefaultAddr()
            }, function(error, result) {
                if(!error) {
                    _this.tokenList.vite.balance = result;
                    res(result);
                } else {
                    rej(error);
                }
            });
        });
    }
    getEthBalance() {
        return this.web3.getBalance(this.getDefaultAddr()).then((balance) => {
            this.tokenList.eth.balance = balance;
            return balance;
        });
    }

    getDefaultAddr() {
        if (!this.addrs || !this.addrs.length) {
            return null;
        }
        return this.addrs[this.defaultAddrInx].hexAddr;
    }
    addAddr() {
        let index = this.addrs.length;
        let addrObj = address(this.mnemonic, index);
        this.addrs.push(addrObj);
        return addrObj.hexAddr;
    }

    getTxData(value, toAddr, type) {
        if (type === 'sendTx') {
            return '';
        }
        return '0xa9059cbb' + addPreZero( toAddr.slice(2) ) + addPreZero( utils.toHex(value).substr(2) );
    }
    estimateGas(toAddr, value, type) {
        let to = type === 'exchange' ? blackHole : toAddr;
        let v = type === 'sendContractTx' ? '0' : value;
        return this.web3.estimateGas({
            to,
            data: this.getTxData(v, to, type)
        });
    }
    
    // ETH
    async sendTx({
        toAddress, value, gwei
    }) {
        const { ethTxHash } = await getTxHash.call(this, {
            toAddress, value, gwei,
            data: ''
        });

        return sendEthTx.call(this, ethTxHash);
    }

    async sendContractTx({
        toAddress, value, gwei
    }) {
        const { ethTxHash } = await getTxHash.call(this, {
            toAddress: viteContractAddr, 
            value: '0x00',
            gwei,
            // contranctMethod(transfer), signature hash
            // toEthAddress (Remove 0x and filled up to 64 bits)
            // value (Remove 0x and filled up to 64 bits)
            data: this.getTxData(value, toAddress, 'sendContractTx')
        });

        return sendEthTx.call(this, ethTxHash);
    }

    async exchangeVite({
        viteAddr, value, gwei
    }) {
        let acount = this.addrs[this.defaultAddrInx];
        let ethAddr = acount.hexAddr;
        let privateKey = acount.wallet.privKey;

        const { ethTxHash, hash } = await getTxHash.call(this, {
            toAddress: viteContractAddr, 
            value: '0x00',
            gwei,
            // contranctMethod(transfer), signature hash
            // toEthAddress (Remove 0x and filled up to 64 bits)
            // value (Remove 0x and filled up to 64 bits)
            data: this.getTxData(value, blackHole, 'sendContractTx')
        });

        let signResult = signBinding({
            hash, viteAddr, value, privateKey, ethAddr
        });

        try {
            await gwBind(signResult);
        } catch(err) {
            if (+err.code === 201) {
                return sendEthTx.call(this, ethTxHash);
            }
            return Promise.reject(err);
        }

        return sendEthTx.call(this, ethTxHash);
    }
}

export default ethWallet;



function addPreZero(num){
    let t = (num + '').length;
    let s = '';
    for (let i=0; i<64-t; i++) {
        s += '0';
    }
    return s + num;
}

async function getTxHash({
    toAddress, value, data, gwei
}) {
    let acount = this.addrs[this.defaultAddrInx];
    let ethAddr = acount.hexAddr;
    let privateKey = acount.wallet.privKey;

    let nonce = await this.web3.getTransactionCount(ethAddr, this.web3.defaultBlock.pending);
    let gasPrice = utils.toWei(gwei + '', 'gwei').toString();

    let txData = {
        nonce: utils.toHex(nonce++),
        gasLimit: utils.toHex(50000),
        gasPrice: utils.toHex(gasPrice),
        value: utils.toHex(value),
        to: toAddress,
        from: ethAddr,
        data,
        chainId: process.env.NODE_ENV === 'production' ? 1 : 3
    };

    let tx = new Tx(txData);
    tx.sign(privateKey);

    let hash = tx.hash().toString('hex');
    let serializedTx = tx.serialize().toString('hex');
    let ethTxHash = '0x' + serializedTx.toString('hex');

    return {
        hash: '0x' + hash,
        ethTxHash
    };
}

function sendEthTx(ethTxHash) {
    return new Promise((res, rej) => {
        this.web3.sendSignedTransaction(ethTxHash, (err, hash) => {
            if (!err) {
                return res(hash);
            }
            return rej(err);
        });
    });
}
