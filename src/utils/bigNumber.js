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
BigNumber.config({FORMAT: normalFormat});

const DP = 8;

export default {
    compared(x, y) {
        BigNumber.config({FORMAT: normalFormat});
        x = new BigNumber(x);
        y = new BigNumber(y);

        return x.comparedTo(y);
    },
    isEqual(num1, num2) {
        BigNumber.config({FORMAT: normalFormat});
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);

        return num1.isEqualTo(num2);
    },
    minus(x, y, fix = 8, type = 'fix') {
        BigNumber.config(normalFormat);
        x = new BigNumber(x);
        y = new BigNumber(y);
        const result = x.minus(y);

        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    plus(x, y, fix = 8, type = 'fix') {
        BigNumber.config({FORMAT: normalFormat});
        x = new BigNumber(x);
        y = new BigNumber(y);
        const result = x.plus(y);

        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    multi(x, y, fix = 8) {
        BigNumber.config(normalFormat);
        x = new BigNumber(x);
        y = new BigNumber(y);

        return x.multipliedBy(y).toFormat(fix);
    },
    dividedToNumber(num1, num2, fix = 0, type = 'fix') {
        BigNumber.config({FORMAT: normalFormat});
        num1 = new BigNumber(num1);
        num2 = new BigNumber(num2);
        if (fix === 0) {
            return num1.dividedBy(num2).integerValue(BigNumber.ROUND_CEIL)
                .toNumber();
        }

        const result = num1.dividedBy(num2);

        return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
    },
    toBasic(num, minUnit = 0, decimalPlaces = DP) {
        BigNumber.config({FORMAT: normalFormat});
        const min = new BigNumber(10).exponentiatedBy(minUnit);
        num = new BigNumber(num);
        if (num.c === null) {
            return '';
        }
        try {
            return num.dividedBy(min).decimalPlaces(decimalPlaces, 1)
                .toFormat();
        } catch (err) {
            return '';
        }
    },
    toMin(num, minUnit) {
        BigNumber.config({FORMAT: normalFormat});
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
        BigNumber.config({FORMAT: groupFormat});
        decimal = decimal >= fix ? fix : decimal;
        const n = new BigNumber(num);

        return n.toFormat(decimal);
    }
};
