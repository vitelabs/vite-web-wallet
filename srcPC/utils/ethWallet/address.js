const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');

const hdPathString = 'm/44\'/60\'/0\'/0';

export function getWalletAddr(mnemonic, index) {
    const root = getRoot(mnemonic);
    const child = root.deriveChild(index);
    const wallet = child.getWallet();

    return {
        wallet,
        hexAddr: `0x${ wallet.getAddress().toString('hex') }`
    };
}

export function getWrongWalletAddr(mnemonic, index) {
    const rootHex = getRootByHex(mnemonic);
    const childHex = rootHex.deriveChild(index);
    const walletHex = childHex.getWallet();

    return {
        wallet: walletHex,
        hexAddr: `0x${ walletHex.getAddress().toString('hex') }`
    };
}

// It's Wrong !!!!!!!!!!
function getRootByHex(mnemonic) {
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    return hdWallet.derivePath(hdPathString);
}

function getRoot(mnemonic) {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    return hdWallet.derivePath(hdPathString);
}
