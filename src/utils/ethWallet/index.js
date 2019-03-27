const web3Eth = require('web3-eth');
const utils = require('web3-utils');
const Tx = require('ethereumjs-tx');
// Web3-providers-ws cannot work in IE.
const ethProvider = require('web3-providers-http');

import localStorage from 'utils/localStorage';
import { bind as gwBind, balance as gwBalance } from 'services/conversion';
import { timer } from 'utils/asyncFlow';
import { getWalletAddr, getWrongWalletAddr } from './address';
import { viteContractAbi, viteContractAddr, blackHole, signBinding } from './viteContract';

const DefaultAddr = 'conversionDefaultAddr';
const balanceTime = 2000;
let provider = null;

class ethWallet {
    constructor({ mnemonic }) {
        this.utils = utils;
        this.mnemonic = mnemonic;

        // Initing --- 0, only true --- 1, only wrong --- 2
        this.addrNum = 0;
        this.addrObj = getWalletAddr(this.mnemonic, 0);
        this.wrongAddrObj = getWrongWalletAddr(this.mnemonic, 0);
        this.activeAddr = this.addrObj;

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
                // 18
                decimals: utils.unitMap.ether.length - 1,
                balance: 0
            }
        };
        this._initVite();

        this.balanceInfoInst = null;
        this.viteBalanceInfoInst = null;
        this.wrongLoop = null;
    }

    init(cb) {
        this._getWrongBalance().then(({ viteBalance, ethBalance }) => {
            this._stopWrongLoop();
            const haveBalance = +viteBalance || +ethBalance;
            const lastActiveAddr = localStorage.getItem(DefaultAddr);

            this.addrNum = haveBalance ? 2 : 1;
            if (haveBalance && lastActiveAddr === this.wrongAddrObj.hexAddr) {
                this.activeAddr = this.wrongAddrObj;
                this.tokenList.vite.balance = viteBalance;
                this.tokenList.eth.balance = ethBalance;
            }
            this._loopBalance();
            cb && cb();
        })
            .catch(err => {
                console.warn(err);

                this._stopWrongLoop();
                this.wrongLoop = setTimeout(() => {
                    this.init();
                }, balanceTime);
            });
    }

    _stopWrongLoop() {
        this.wrongLoop && clearTimeout(this.wrongLoop);
        this.wrongLoop = null;
    }

    async _getWrongBalance() {
        const wrongAddr = this.wrongAddrObj.hexAddr;

        const viteBalance = await gwBalance({ address: wrongAddr }).then(data => data && data.VITE ? data.VITE.Balance || 0 : 0);

        const ethBalance = await this.web3.getBalance(wrongAddr);

        return { viteBalance, ethBalance };
    }

    changeActiveAddr(addr) {
        if (this.addrNum < 2 || addr !== this.wrongAddrObj && addr !== this.addrObj) {
            return;
        }
        this.tokenList.vite.balance = 0;
        this.tokenList.eth.balance = 0;
        this.activeAddr = addr;
        localStorage.setItem(DefaultAddr, addr.hexAddr);
    }

    destroyed() {
        this._stopWrongLoop();
        this._stopLoopBalance();
    }

    _initVite() {
        const _this = this;
        this.contract.methods.decimals().call({ from: this.getDefaultAddr() }, function (error, result) {
            !error && (_this.viteDecimals = result);
        });
        this.contract.methods.symbol().call({ from: this.getDefaultAddr() }, function (error, result) {
            !error && (_this.tokenList.vite.symbol = result);
        });
    }

    _loopBalance() {
        this._stopLoopBalance();

        this.getEthBalance();
        this.balanceInfoInst = new timer(() => this.getEthBalance(), balanceTime);
        this.balanceInfoInst.start();

        this.getViteBalance();
        this.viteBalanceInfoInst = new timer(() => this.getViteBalance(), balanceTime);
        this.viteBalanceInfoInst.start();
    }

    _stopLoopBalance() {
        this.balanceInfoInst && this.balanceInfoInst.stop();
        this.balanceInfoInst = null;
        this.viteBalanceInfoInst && this.viteBalanceInfoInst.stop();
        this.viteBalanceInfoInst = null;
    }

    getViteBalance() {
        const address = this.getDefaultAddr();

        return gwBalance({ address }).then(data => {
            if (address !== this.getDefaultAddr()) {
                return;
            }
            this.tokenList.vite.balance = data && data.VITE ? data.VITE.Balance || 0 : 0;
        });
    }

    getEthBalance() {
        const address = this.getDefaultAddr();

        return this.web3.getBalance(address).then(balance => {
            if (address !== this.getDefaultAddr()) {
                return;
            }
            this.tokenList.eth.balance = balance;

            return balance;
        });
    }

    getDefaultAddr() {
        return this.activeAddr.hexAddr;
    }

    getTxData(value, toAddr, type) {
        if (type === 'sendTx') {
            return '';
        }

        return `0xa9059cbb${ addPreZero(toAddr.slice(2)) }${ addPreZero(utils.toHex(value).substr(2)) }`;
    }

    estimateGas(toAddr, value, type) {
        const to = type === 'exchange' ? blackHole : toAddr;
        const v = type === 'sendContractTx' ? '0' : value;

        return this.web3.estimateGas({
            to,
            data: this.getTxData(v, to, type)
        });
    }

    // ETH
    async sendTx({ toAddress, value, gwei }) {
        const { ethTxHash } = await getTxHash.call(this, {
            toAddress,
            value,
            gwei,
            data: ''
        });

        return sendEthTx.call(this, ethTxHash);
    }

    async sendContractTx({ toAddress, value, gwei }) {
        const { ethTxHash } = await getTxHash.call(this, {
            toAddress: viteContractAddr,
            value: '0x00',
            gwei,
            // ContranctMethod(transfer), signature hash
            // toEthAddress (Remove 0x and filled up to 64 bits)
            // value (Remove 0x and filled up to 64 bits)
            data: this.getTxData(value, toAddress, 'sendContractTx')
        });

        return sendEthTx.call(this, ethTxHash);
    }

    async conversion({ viteAddr, value, gwei }) {
        const acount = this.activeAddr;
        const ethAddr = acount.hexAddr;
        const privateKey = acount.wallet.privKey;

        const { ethTxHash, hash } = await getTxHash.call(this, {
            toAddress: viteContractAddr,
            value: '0x00',
            gwei,
            // ContranctMethod(transfer), signature hash
            // toEthAddress (Remove 0x and filled up to 64 bits)
            // value (Remove 0x and filled up to 64 bits)
            data: this.getTxData(value, blackHole, 'sendContractTx')
        });

        const signResult = signBinding({ hash, viteAddr, value, privateKey, ethAddr });

        try {
            await gwBind(signResult);
        } catch (err) {
            if (+err.code === 201) {
                return sendEthTx.call(this, ethTxHash);
            }

            return Promise.reject(err);
        }

        return sendEthTx.call(this, ethTxHash);
    }
}

export default ethWallet;


function addPreZero(num) {
    const t = (`${ num }`).length;
    let s = '';
    for (let i = 0; i < 64 - t; i++) {
        s += '0';
    }

    return s + num;
}

async function getTxHash({ toAddress, value, data, gwei }) {
    const acount = this.activeAddr;
    const ethAddr = acount.hexAddr;
    const privateKey = acount.wallet.privKey;

    let nonce = await this.web3.getTransactionCount(ethAddr, this.web3.defaultBlock.pending);
    const gasPrice = utils.toWei(`${ gwei }`, 'gwei').toString();
    const gasLimit = process.env.NODE_ENV === 'production' ? 60000 : 99000;

    const txData = {
        nonce: utils.toHex(nonce++),
        gasLimit: utils.toHex(gasLimit),
        gasPrice: utils.toHex(gasPrice),
        value: utils.toHex(value),
        to: toAddress,
        from: ethAddr,
        data,
        chainId: process.env.NODE_ENV === 'production' ? 1 : 3
    };

    const tx = new Tx(txData);
    tx.sign(privateKey);

    const hash = tx.hash().toString('hex');
    const serializedTx = tx.serialize().toString('hex');
    const ethTxHash = `0x${ serializedTx.toString('hex') }`;

    return {
        hash: `0x${ hash }`,
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
