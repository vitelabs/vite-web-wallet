import BigNumber from 'bignumber.js';

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

const DP = 8;

export default {
    compared(x, y) {
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.comparedTo(y);
    },
    isEqual(num1, num2) {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        return num1.isEqualTo(num2);
    },
    minus(x, y, fix = 8, type = 'fix') {
        x = new BigNumber(x);
        y = new BigNumber(y);
        let result = x.minus(y);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    multi(x, y, fix = 8) {
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.multipliedBy(y).toFormat(fix);
    },
    dividedToNumber(num1, num2, fix = 0, type = 'fix') {
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        if (fix === 0) {
            return num1.dividedBy(num2).integerValue(BigNumber.ROUND_CEIL).toNumber();
        }

        let result = num1.dividedBy(num2);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    toBasic(num, minUnit = 0, decimalPlaces = DP) {
        let min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
        if (num.c == null) {
            return '';
        }
        try {
            return num.dividedBy(min).decimalPlaces(decimalPlaces, 1).toFormat();
        } catch(err) {
            return '';
        }
    },
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
};
