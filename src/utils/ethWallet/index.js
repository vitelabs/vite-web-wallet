const web3 = require('web3');
const Tx = require('ethereumjs-tx');
const ethProvider = require('web3-providers-ws');

import { bind as gwBind } from 'services/gateway';
import { timer } from 'utils/asyncFlow';
import address from './address';
import { viteContractAbi, viteContractAddr, blackHole, signBinding } from './viteContract';

const gas = 60000;
const balanceTime = 2000;
let provider = null;

// console.log(signBinding());

class ethWallet {
    constructor({
        mnemonic
    }) {
        provider = provider || new ethProvider(process.env.ethServer);
        this.web3 = new web3(provider);
        this.mnemonic = mnemonic;
        this.defaultAddrInx = 0;
        this.addrs = [];
        this.addAddr();

        this.contract = new this.web3.eth.Contract(viteContractAbi, viteContractAddr);
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
                decimals: web3.utils.unitMap.ether.length -1, // 18
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
        return this.web3.eth.getBalance(this.getDefaultAddr()).then((balance) => {
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

    isAddress(address) {
        return this.web3.utils.isAddress(address);
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
            data: '0xa9059cbb' + addPreZero( toAddress.slice(2) ) + addPreZero( this.web3.utils.toHex(value).substr(2) ), 
        });

        return sendEthTx.call(this, ethTxHash);
    }

    async exchangeVite({
        viteAddr, value, gwei
    }) {
        console.log(value);
        // console.log(gwei = 80);
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
            data: '0xa9059cbb' + addPreZero( blackHole.slice(2) ) + addPreZero( this.web3.utils.toHex(value).substr(2) ), 
        });

        console.log(hash);

        let signResult = signBinding({
            hash, viteAddr, value, privateKey, ethAddr
        });

        await gwBind(signResult);

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
    let g = gwei * gas * 1000;

    let acount = this.addrs[this.defaultAddrInx];
    let ethAddr = acount.hexAddr;
    let privateKey = acount.wallet.privKey;

    let nonce = await this.web3.eth.getTransactionCount(ethAddr, this.web3.eth.defaultBlock.pending);

    let txData = {
        nonce: this.web3.utils.toHex(nonce++),
        gasLimit: this.web3.utils.toHex(99000),    // ???
        gasPrice: this.web3.utils.toHex(g),  
        to: toAddress,
        from: ethAddr,
        value,
        data,
        chainId: process.env.NODE_ENV === 'production' ? 1 : 3
    };
    console.log(txData);

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
        this.web3.eth.sendSignedTransaction(ethTxHash, (err, hash) => {
            if (!err) {
                console.log(hash);
                return res(hash);
            }
            return rej(err);
        });
    });
}
