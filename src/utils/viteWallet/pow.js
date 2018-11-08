
class Pow {
    constructor(provider, utils) {
        this.provider = provider;
        this.utils = utils;
    }
    
    getNonce(addr, prevHash, difficulty = process.env.powDifficulty) {
        let realAddr = $ViteJS.Wallet.Address.getAddrFromHexAddr(addr);
        let hash = this.utils.bytesToHex(this.utils.blake2b(this.utils.hexToBytes(realAddr + prevHash), null, 32));
        return this.provider.request('pow_getPowNonce', [difficulty, hash]).then((data) => {
            return {
                nonce: data.result,
                difficulty
            };
        });
    }
}

export default Pow;
