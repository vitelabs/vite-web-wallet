class Pow {
    constructor(utils) {
        this.encoder = utils.encoder;
        this.addressLibs = utils.address;
    }
    
    // http: ??
    async getNonce(addr, prevHash, difficulty = process.env.powDifficulty) {
        let realAddr = this.addressLibs.privToAddr.getAddrFromHexAddr(addr);
        let hash = this.encoder.bytesToHex(
            this.encoder.blake2b(
                this.encoder.hexToBytes(realAddr + prevHash), 
                null, 
                32
            )
        );

        const result = await $ViteJS.request('pow_getPowNonce', difficulty, hash);
        return {
            nonce: result,
            difficulty
        };
    }
}

export default Pow;
