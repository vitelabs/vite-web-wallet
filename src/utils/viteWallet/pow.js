class Pow {
    constructor(utils) {
        this.encoder = utils.encoder;
        this.addressLibs = utils.address;
    }
    
    // http: ??
    async getNonce(addr, prevHash, difficulty = process.env.powDifficulty) {
        let realAddr = this.addressLibs.getAddrFromHexAddr(addr);
        let hash = this.encoder.bytesToHex(
            this.encoder.blake2b(
                this.encoder.hexToBytes(realAddr + prevHash), 
                null, 
                32
            )
        );

        const data = await $ViteJS._provider.request('pow_getPowNonce', [difficulty, hash]);
        return {
            nonce: data.result,
            difficulty
        };
    }
}

export default Pow;
