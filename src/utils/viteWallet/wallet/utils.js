export default {
    getMnemonic(entropy) {
        return $ViteJS.Wallet.Address.getMnemonicFromEntropy(entropy);
    }
};