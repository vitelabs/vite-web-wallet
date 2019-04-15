import BigNumber from 'bignumber.js';

const groupFormat = {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0
};
const normalFormat = {
    decimalSeparator: '.',
    groupSeparator: '',
    groupSize: 0,
    secondaryGroupSize: 0,
    fractionGroupSeparator: '',
    fractionGroupSize: 0
};

const normalConfig = {
    FORMAT: normalFormat,
    ROUNDING_MODE: BigNumber.ROUND_FLOOR
};

const groupConfig = {
    FORMAT: groupFormat,
    ROUNDING_MODE: BigNumber.ROUND_FLOOR
};

BigNumber.config(normalConfig);

const DP = 8;

export default {
    compared(x, y) {
        BigNumber.config(normalConfig);
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.comparedTo(y);
    },
    isEqual(num1, num2) {
        BigNumber.config(normalConfig);
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        return num1.isEqualTo(num2);
    },
    minus(x, y, fix = 8, type = 'fix') {
        BigNumber.config(normalConfig);
        x = new BigNumber(x);
        y = new BigNumber(y);
        const result = x.minus(y);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    plus(x, y, fix = 8, type = 'fix') {
        BigNumber.config(normalConfig);
        x = new BigNumber(x);
        y = new BigNumber(y);
        const result = x.plus(y);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    multi(x, y, fix = 8) {
        BigNumber.config(normalConfig);
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.multipliedBy(y).toFormat(fix);
    },
    dividedToNumber(num1, num2, fix = 0, type = 'fix') {
        BigNumber.config(normalConfig);
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        // decimalPlaces(fix, 0).toFormat();
        if (fix === 0) {
            return num1.dividedBy(num2).integerValue().toString();
        }

        const result = num1.dividedBy(num2);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    toBasic(num, minUnit = 0, decimalPlaces = DP) {
        BigNumber.config(normalConfig);
        const min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
        if (num.c === null) {
            return '';
        }

        try {
            return num.dividedBy(min).decimalPlaces(decimalPlaces, 1).toFormat();
        } catch (err) {
            return '';
        }
    },
    toMin(num, minUnit) {
        BigNumber.config(normalConfig);
        const min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
        if (num.c === null) {
            return '';
        }

        try {
            return num.multipliedBy(min).toFormat();
        } catch (err) {
            return '';
        }
    },
    formatNum(num, decimal = 8, fix = 8) {
        BigNumber.config(groupConfig);
        decimal = decimal >= fix ? fix : decimal;
        const n = new BigNumber(num);
        return n.toFormat(decimal);
    },
    normalFormatNum(num, decimal = 8, fix = 8) {
        BigNumber.config(normalConfig);
        decimal = decimal >= fix ? fix : decimal;
        const n = new BigNumber(num);
        return n.toFormat(decimal);
    }
};
