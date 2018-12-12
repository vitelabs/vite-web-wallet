const Account = require('eth-lib/lib/account');
const utils = require('web3-utils');


export const viteContractAddr = process.env.contractAddress;

export const viteContractAbi = [{'constant':true,'inputs':[],'name':'name','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_value','type':'uint256'}],'name':'approve','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalSupply','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_from','type':'address'},{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transferFrom','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'decimals','outputs':[{'name':'','type':'uint8'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_subtractedValue','type':'uint256'}],'name':'decreaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'}],'name':'balanceOf','outputs':[{'name':'balance','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'symbol','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transfer','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_addedValue','type':'uint256'}],'name':'increaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'},{'name':'_spender','type':'address'}],'name':'allowance','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'payable':true,'stateMutability':'payable','type':'fallback'},{'anonymous':false,'inputs':[{'indexed':true,'name':'owner','type':'address'},{'indexed':true,'name':'spender','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Approval','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'name':'from','type':'address'},{'indexed':true,'name':'to','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Transfer','type':'event'}];

export const blackHole = '0x1111111111111111111111111111111111111111';

export const signBinding = function ({
    ethTxHash, viteAddr, value, privateKey, publicKey, ethAddr
}) {
    // let acount = this.addrs[this.defaultAddrInx];
    // let ethAddr = acount.hexAddr;
    // let privateKey = acount.wallet.privKey;
    // let publicKey = acount.wallet.pubKey;

    let privKey = utils.bytesToHex(privateKey);
    let BindReq = {
        'pub_key': utils.bytesToHex(publicKey),
        'eth_tx_hash': ethTxHash,
        'eth_addr': ethAddr,
        'vite_addr': viteAddr,
        value
    };

    let text = JSON.stringify(BindReq);
    let hash = utils.soliditySha3(text);
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
}; 