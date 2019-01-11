const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

const hdPathString = 'm/44\'/60\'/0\'/0';

export default function(mnemonic, index) {
    let root = getRoot(mnemonic);
    let child = root.deriveChild(index);
    let wallet = child.getWallet();
    return {
        wallet,
        hexAddr: '0x' + wallet.getAddress().toString('hex')
    };
}


function getRoot(mnemonic) {
    let seed = bip39.mnemonicToSeed(mnemonic);
    // let seed = bip39.mnemonicToSeedHex(mnemonic);
    let hdWallet = hdkey.fromMasterSeed(seed);
    return hdWallet.derivePath(hdPathString);
}
