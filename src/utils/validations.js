import BigNumber from 'utils/bigNumber';
import i18n from 'i18n';
export function validFormat(amount = '', decimals = 8) {
    const limit = decimals >= 8 ? 8 : decimals;
    const decimalNum = decimals ? new RegExp(`^\\d+[.]\\d{1,${ limit }}$`) : null;
    const isInt = new RegExp('^(\\d+)$').test(amount);
    const isPoint = new RegExp('^\\d+[.]\\d+$').test(amount);
    if (!isInt && !isPoint) {
        return 1;
    }
    if (isPoint && !(decimalNum && decimalNum.test(amount))) {
        return 2;
    }
    return 0;
}

export function getValidBalance({ decimals, balance, minNum, maxNum }) {
    return function (amount) {
        if (!amount) {
            return null;
        }

        if (validFormat(amount, decimals)) {
            return i18n.t('hint.amtFormat');
        }

        if (maxNum !== undefined) {
            if (BigNumber.compared(amount, maxNum) > 0) {
                return i18n.t('walletQuota.limitAmt', { num: maxNum });
            }
        }
        if (minNum !== undefined) {
            if (BigNumber.compared(amount, minNum) < 0) {
                return i18n.t('walletQuota.limitAmt', { num: minNum });
            }
        }
        if (balance !== undefined) {
            const amount = BigNumber.toMin(amount, decimals);
            if (BigNumber.compared(balance, amount) < 0) {
                return i18n.t('hint.insufficientBalance');
            }
        }
        return null;
    };
}
