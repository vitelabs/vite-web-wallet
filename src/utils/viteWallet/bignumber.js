import BigNumber from 'bignumber.js';

const DP = 8;

class bignumber {
    constructor() {
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
    }

    compared(x, y) {
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.comparedTo(y);
    }

    isEqual(num1, num2) {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        return num1.isEqualTo(num2);
    }

    dividedToNumber(num1, num2, fix = 0) {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        if (fix === 0) {
            return num1.dividedBy(num2).integerValue(BigNumber.ROUND_CEIL).toNumber();
        }
        return num1.dividedBy(num2).toFixed(fix);
    }

    toBasic(num, minUnit = 0, decimalPlaces = DP) {
        let min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
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
        let min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.multipliedBy(min).toFormat();
        } catch(err) {
            return '';
        }
    }
}

export default bignumber;
