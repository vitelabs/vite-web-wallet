
class Token {
    constructor($ViteJS) {
        this.$ViteJS = $ViteJS;
        this.tokens = {};
    }

    getTokenMintage(tokenId) {
        if (this.tokens[tokenId]) {
            return Promise.resolve(this.tokens[tokenId]);
        }

        return this.$ViteJS.Vite.Ledger.getTokenMintage(tokenId).then((data)=>{
            this.tokens[tokenId] = data.result;
            return this.tokens[tokenId];
        });
    }

}

module.exports = Token;
