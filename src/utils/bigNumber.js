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

const ceilConfig = {
    FORMAT: normalFormat,
    ROUNDING_MODE: BigNumber.ROUND_CEIL
};

BigNumber.config(normalConfig);
const GroupBigNumber = BigNumber.clone(groupConfig);
const CeilBigNumber = BigNumber.clone(ceilConfig);

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
        const result = x.minus(y);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    plus(x, y, fix = 8, type = 'fix') {
        x = new BigNumber(x);
        y = new BigNumber(y);
        const result = x.plus(y);
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
            return num1.dividedBy(num2).integerValue().toString();
        }

        const result = num1.dividedBy(num2);
        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    dividedCeil(num1, num2, fix = 0) {
        num1 = new CeilBigNumber(num1);
        num2 = new CeilBigNumber(num2);
        const result = num1.dividedBy(num2);
        return result.toFormat(fix);
    },
    toBasic(num, minUnit = 0, decimalPlaces = DP) {
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
    exponentiated(num, unit, offset = 0) {
        const number = new BigNumber(num).exponentiatedBy(unit);
        const offsetNum = new BigNumber(offset);
        const result = number.plus(offsetNum);
        return result.toFormat();
    },
    toMin(num, minUnit) {
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
        decimal = decimal >= fix ? fix : decimal;
        const n = new GroupBigNumber(num);
        return n.toFormat(decimal);
    },
    normalFormatNum(num, decimal = 8, fix = 8) {
        decimal = decimal >= fix ? fix : decimal;
        const n = new BigNumber(num);
        return n.toFormat(decimal);
    },
    onlyFormat(num) {
        const n = new GroupBigNumber(num);
        return n.toFormat();
    }
};
