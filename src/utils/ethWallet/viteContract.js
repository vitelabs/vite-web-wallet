const Account = require('eth-lib/lib/account');
const utils = require('web3-utils');
const elliptic = require('elliptic');
const secp256k1 = new elliptic.ec('secp256k1');

export const viteContractAddr = process.env.contractAddress;

export const viteContractAbi = [{'constant':true,'inputs':[],'name':'name','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_value','type':'uint256'}],'name':'approve','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'totalSupply','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_from','type':'address'},{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transferFrom','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[],'name':'decimals','outputs':[{'name':'','type':'uint8'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_subtractedValue','type':'uint256'}],'name':'decreaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'}],'name':'balanceOf','outputs':[{'name':'balance','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':true,'inputs':[],'name':'symbol','outputs':[{'name':'','type':'string'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'name':'_to','type':'address'},{'name':'_value','type':'uint256'}],'name':'transfer','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'name':'_spender','type':'address'},{'name':'_addedValue','type':'uint256'}],'name':'increaseApproval','outputs':[{'name':'','type':'bool'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'name':'_owner','type':'address'},{'name':'_spender','type':'address'}],'name':'allowance','outputs':[{'name':'','type':'uint256'}],'payable':false,'stateMutability':'view','type':'function'},{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'payable':true,'stateMutability':'payable','type':'fallback'},{'anonymous':false,'inputs':[{'indexed':true,'name':'owner','type':'address'},{'indexed':true,'name':'spender','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Approval','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'name':'from','type':'address'},{'indexed':true,'name':'to','type':'address'},{'indexed':false,'name':'value','type':'uint256'}],'name':'Transfer','type':'event'}];

export const blackHole = '0x1111111111111111111111111111111111111111';

export const signBinding = function ({
    hash, viteAddr, value, privateKey, ethAddr
}) {
    let ecKey = secp256k1.keyFromPrivate(privateKey);
    let pubKey = '0x' + ecKey.getPublic(false, 'hex');
    let privKey = utils.bytesToHex(privateKey);

    let BindReq = {
        'pub_key': pubKey,
        'eth_tx_hash': hash,
        'eth_addr': ethAddr,
        'vite_addr': viteAddr,
        value
    };

    let text = JSON.stringify(BindReq);
    let bindingHash = utils.soliditySha3(text);
    console.log(bindingHash);
    BindReq.signature = Account.sign(bindingHash, privKey);

    return BindReq;
}; 




// // {   "pub_key":"0x049a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05","eth_tx_hash":"0x16c1bc2b05788eeab04faf12ee7bec8d49718182ec973e1839e7d0fae475faa2","eth_addr":"0x96216849c49358B10257cb55b28eA603c874b05E","vite_addr":"vite_29a3ec96d1e4a52f50e3119ed9945de09bef1d74a772ee60ff","value":"100000"}
 
// // {"pub_key":"0x049a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05",
// // "eth_tx_hash":"0x16c1bc2b05788eeab04faf12ee7bec8d49718182ec973e1839e7d0fae475faa2",
// // "eth_addr":"0x96216849c49358B10257cb55b28eA603c874b05E",
// // "vite_addr":"vite_29a3ec96d1e4a52f50e3119ed9945de09bef1d74a772ee60ff",
// // "value":"100000",
// // "signature":"0x2fa38b443646c7f0acf4672a8b06d656ff66f1909c9ff3b5d0a3f90cc5cb96152d25f20dcd01260eb438f6dac635cd7e4195a4367bb03b0d196ce875ff16f8ca00"}

// var buffer = new Buffer('0xfad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19'.slice(2), 'hex');
// var ecKey = secp256k1.keyFromPrivate(buffer);
// var publicKey = '0x' + ecKey.getPublic(false, 'hex').slice(2);
// var pubKey = '0x' + ecKey.getPublic(false, 'hex');
// console.log(publicKey);
// console.log(pubKey);

// let BindReq = {
//     'pub_key':'0x049a7df67f79246283fdc93af76d4f8cdd62c4886e8cd870944e817dd0b97934fdd7719d0810951e03418205868a5c1b40b192451367f28e0088dd75e15de40c05',
//     'eth_tx_hash':'0x16c1bc2b05788eeab04faf12ee7bec8d49718182ec973e1839e7d0fae475faa2',
//     'eth_addr':'0x96216849c49358B10257cb55b28eA603c874b05E',
//     'vite_addr':'vite_29a3ec96d1e4a52f50e3119ed9945de09bef1d74a772ee60ff',
//     'value':'100000'
// };
// let str = JSON.stringify(BindReq);
// let hash = utils.soliditySha3(str);
// console.log(hash);

// var signature = secp256k1.keyFromPrivate(
//     new Buffer('0xfad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19'.slice(2), 'hex')
// ).sign(new Buffer(hash.slice(2), 'hex'), { 
//     canonical: true 
// });


// // let s = Account.encodeSignature([
// //     Bytes.pad(1, Bytes.fromNumber(27 + signature.recoveryParam)), 
// //     Bytes.pad(32, Bytes.fromNat('0x' + signature.r.toString(16))), 
// //     Bytes.pad(32, Bytes.fromNat('0x' + signature.s.toString(16)))
// // ]);

// // console.log(Account.recover(hash, s));
// console.log(Account.recover('0x09cd8a764d72f38494ef58f6e5d3a30bd8caab7357f0d62cd9fed4b721c35432', '0xeb166ec32fd1eb8c864dea88aad6d67fe39ee86eb15707215c23e6c3181260281878f9748fc75bf5f902396f73c772e1c4ee24da1c2cc5841327af371ae41f6a1b'));
  

// // var signature = secp256k1.keyFromPrivate(new Buffer(privateKey.slice(2), 'hex')).sign(new Buffer(hash.slice(2), 'hex'), { canonical: true });

// let signature = Account.sign(hash, '0xfad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19');

// console.log({
//     BindReq, s
// });
// return {
//     BindReq, signature
// };