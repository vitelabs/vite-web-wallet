const DP = 8;

class Token {
    constructor(BigNumber) {
        BigNumber.config({ 
            FORMAT: {
                decimalSeparator: '.',
                groupSeparator: '',
                groupSize: 0,
                secondaryGroupSize: 0,
                fractionGroupSeparator: ' ',
                fractionGroupSize: 0
            }
        });

        this.BigNumber = BigNumber;
        this.tokens = {};
    }

    getTokenMintage(tokenId) {
        if (this.tokens[tokenId]) {
            return Promise.resolve(this.tokens[tokenId]);
        }

        return $ViteJS.Vite.Ledger.getTokenMintage(tokenId).then((data)=>{
            this.tokens[tokenId] = data.result;
            return this.tokens[tokenId];
        });
    }

    isEqual(num1, num2) {
        num1 = new this.BigNumber(num1);
        num2 = new this.BigNumber(num2);
        return num1.isEqualTo(num2);
    }

    dividedToNumber(num1, num2) {
        num1 = new this.BigNumber(num1);
        num2 = new this.BigNumber(num2);
        return num1.dividedBy(num2).integerValue(this.BigNumber.ROUND_CEIL).toNumber();
    }

    toBasic(num, minUnit = 0, decimalPlaces = DP) {
        let min = new this.BigNumber(10).exponentiatedBy(minUnit);
        num = new this.BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.dividedBy(min).decimalPlaces(decimalPlaces).toFormat();
        } catch(err) {
            return '';
        }
    }

    toMin(num, minUnit) {
        num = new this.BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.multipliedBy(minUnit).toFormat();
        } catch(err) {
            return '';
        }
    }
}

export default Token;
