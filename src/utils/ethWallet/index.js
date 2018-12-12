const bip39 = require('bip39');
const Account = require('eth-lib/lib/account');
const hdkey = require('ethereumjs-wallet/hdkey');
// const eth = require('web3-eth');
const web3 = require('web3');
const ethProvider = require('web3-providers-ws');
// const tx = require('ethereumjs-tx');
// console.log(tx);

// import Bignumber from 'utils/bignumber';
// import request from 'utils/request';
import { timer } from 'utils/asyncFlow';

const hdPathString = 'm/44\'/60\'/0\'/0';
const gas = 60000;
const balanceTime = 2000;

const contractAbi = [{'constant':true,'inputs':[],'name':'name','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_value','type':'uint256'}],'name':'approve','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalSupply','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_from','type':'address'},{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transferFrom','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'decimals','outputs':[{'name':'','type':'uint8'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_subtractedValue','type':'uint256'}],'name':'decreaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'}],'name':'balanceOf','outputs':[{'name':'balance','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'symbol','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transfer','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_addedValue','type':'uint256'}],'name':'increaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'},{'name':'_spender','type':'address'}],'name':'allowance','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'payable':true,'stateMutability':'payable','type':'fallback'},{'anonymous':false,'inputs':[{'indexed':true,'name':'owner','type':'address'},{'indexed':true,'name':'spender','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Approval','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'name':'from','type':'address'},{'indexed':true,'name':'to','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Transfer','type':'event'}];
const contractAddress = '0x54b716345c14ba851f1b51dcc1491abee6ba8f44';
// const contractAddress = '0x1b793e49237758dbd8b752afc9eb4b329d5da016';

class ethWallet {
    constructor({
        mnemonic
    }) {
        // wss://mainnet.infura.io/ws
        let provider = new ethProvider('wss://ropsten.infura.io/ws');
        this.web3 = new web3(provider);

        this.defaultAddrInx = 0;
        this.addrs = [];

        let seed = bip39.mnemonicToSeedHex(mnemonic);
        let hdWallet = hdkey.fromMasterSeed(seed);
        this.root = hdWallet.derivePath(hdPathString);
        this.addAddr();

        this.contract = new this.web3.eth.Contract(contractAbi, contractAddress);

        let _this = this;
        this.contract.methods.decimals().call({
            from: this.getDefaultAddr()
        }, function(error, result) {
            if(!error) {
                _this.viteDecimals = result;
            }
        });

        this.ethBalance = 0;
        this.viteBalance = 0;
        this.balanceInfoInst = null;
        this.viteBalanceInfoInst = null;
        this._loopBalance();
    }

    destroyed() {
        this._stopLoopBalance();
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

    getBalance() {
        // 1000000000000000000, web3.utils.unitMap.ether
        // return this.web3.utils.fromWei(balance, 'ether');
        // return Bignumber.toBasic(balance, 18, 8);
        return {
            vite: {
                decimals: this.viteDecimals,
                balance: this.viteBalance
            },
            eth: {
                decimals: 18,
                balance: this.ethBalance
            }
        };
    }

    getViteBalance() {
        // return request({
        //     path: 'http://132.232.60.116:8000/gw/balance',
        //     params: {
        //         address: this.addrs[this.defaultAddrInx],
        //         token: 'VITE'
        //     }
        // }).then((x) => {
        //     console.log(x);
        //     return x;
        // });
        return new Promise((res, rej) => {
            let _this = this;
            this.contract.methods.balanceOf(this.getDefaultAddr()).call({
                from: this.getDefaultAddr()
            }, function(error, result) {
                if(!error) {
                    _this.viteBalance = result;
                    res(result);
                } else {
                    rej(error);
                }
            });
        });
    }

    getEthBalance() {
        return this.web3.eth.getBalance(this.getDefaultAddr()).then((balance) => {
            this.ethBalance = balance;
            return balance;
        });
    }

    _signBinding({
        ethTxHash, viteAddr, value
    }) {
        let acount = this.addrs[this.defaultAddrInx];
        let ethAddr = acount.hexAddr;
        let privateKey = acount.wallet.privKey;
        let publicKey = acount.wallet.pubKey;

        let privKey = this.web3.utils.bytesToHex(privateKey);
        let BindReq = {
            'pub_key': this.web3.utils.bytesToHex(publicKey),
            'eth_tx_hash': ethTxHash,
            'eth_addr': ethAddr,
            'vite_addr': viteAddr,
            value
        };

        let text = JSON.stringify(BindReq);
        let hash = this.web3.utils.soliditySha3(text);
        let signature = Account.sign(hash, privKey);

        return {
            BindReq, signature
        };

        // let BindReq = {
        //     'pub_key':'0x049a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05',
        //     'eth_tx_hash':'0x16c1bc2b05788eeab04faf12ee7bec8d49718182ec973e1839e7d0fae475faa2',
        //     'eth_addr':'0x96216849c49358B10257cb55b28eA603c874b05E',
        //     'vite_addr':'vite_29a3ec96d1e4a52f50e3119ed9945de09bef1d74a772ee60ff',
        //     'value':'100000'
        // };
        // let str = JSON.stringify(BindReq);
        // let hash = this.web3.utils.soliditySha3(str);

        // let signature = Account.sign(hash, '0xfad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19');

        // console.log({
        //     BindReq, signature
        // });
        // return {
        //     BindReq, signature
        // };
    }

    getDefaultAddr() {
        if (!this.addrs || !this.addrs.length) {
            return null;
        }
        return this.addrs[this.defaultAddrInx].hexAddr;
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

    // ETH
    sendTx() {

    }

    exchangeVite({
        viteAddr, value, Gwei
    }) {
        let g = Gwei * gas;
        this.contract.options = {
            from: this.getDefaultAddr(),
            gas: g
        };

        console.log(g);
        console.log(viteAddr);
        console.log(value);
        // {
        //     "pub_key": "0x049a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05",
        //     "eth_tx_hash": "0x16c1bc2b05788eeab04faf12ee7bec8d49718182ec973e1839e7d0fae475faa2",
        //     "eth_addr": "0x96216849c49358B10257cb55b28eA603c874b05E",
        //     "vite_addr": "vite_29a3ec96d1e4a52f50e3119ed9945de09bef1d74a772ee60ff",
        //     "value": "100000",
        //     "signature": "0x2fa38b443646c7f0acf4672a8b06d656ff66f1909c9ff3b5d0a3f90cc5cb96152d25f20dcd01260eb438f6dac635cd7e4195a4367bb03b0d196ce875ff16f8ca00"
        // }
    }
}

export default ethWallet;
