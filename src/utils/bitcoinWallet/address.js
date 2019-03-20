
// const bip39 = require('bip39');
// const bitcoinjs = require('bitcoinjs-lib');

// const hdPathString = 'm/44\'/0\'/0\'/0';

// export class bitcoinWallet{
// }
// export function getWalletAddr(mnemonic, index) {
//     let root = getRoot(mnemonic);
//     let child = root.deriveChild(index);
//     let wallet = child.getWallet();

//     return {
//         wallet,
//         hexAddr: '0x' + wallet.getAddress().toString('hex')
//     };
// }

// export function getWrongWalletAddr(mnemonic, index) {
//     let rootHex = getRootByHex(mnemonic);
//     let childHex = rootHex.deriveChild(index);
//     let walletHex = childHex.getWallet();
//     return {
//         wallet: walletHex,
//         hexAddr: '0x' + walletHex.getAddress().toString('hex')
//     };
// }

// // It's Wrong !!!!!!!!!!
// function getRootByHex(mnemonic) {
//     let seed = bip39.mnemonicToSeedHex(mnemonic);
//     let hdWallet = hdkey.fromMasterSeed(seed);
//     return hdWallet.derivePath(hdPathString);
// }

// function getBitcoinWallet(mnemonic) {
//     const seed = bip39.mnemonicToSeed(mnemonic);
//     const hdWallet = bitcoinjs.bip32.fromSeed(seed);
//     return hdWallet;
// }
