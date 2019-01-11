const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const hdPathString = 'm/44\'/60\'/0\'/0';

export function getWalletAddr(mnemonic, index) {
    let root = getRoot(mnemonic);    
    let child = root.deriveChild(index);
    let wallet = child.getWallet();

    return {
        wallet,
        hexAddr: '0x' + wallet.getAddress().toString('hex')
    };
}

export function getWrongWalletAddr(mnemonic, index) {
    let rootHex = getRootByHex(mnemonic);
    let childHex = rootHex.deriveChild(index);
    let walletHex = childHex.getWallet();
    return {
        wallet: walletHex,
        hexAddr: '0x' + walletHex.getAddress().toString('hex')
    };
}

function getRootByHex(mnemonic) {
    let seed = bip39.mnemonicToSeedHex(mnemonic);
    let hdWallet = hdkey.fromMasterSeed(seed);
    return hdWallet.derivePath(hdPathString);
}

function getRoot(mnemonic) {
    let seed = bip39.mnemonicToSeed(mnemonic);
    let hdWallet = hdkey.fromMasterSeed(seed);
    return hdWallet.derivePath(hdPathString);
}
