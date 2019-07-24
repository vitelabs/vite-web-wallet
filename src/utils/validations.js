import { constant } from '@vite/vitejs';
import BigNumber from 'utils/bigNumber';
import i18n from 'i18n';

const Vite_Token_Info = constant.Vite_Token_Info;
const MaxDecimals = 8;
const MinStakingAmount = 134;
const minStakingUnit = BigNumber.toMin(MinStakingAmount, Vite_Token_Info.decimals);

export function checkAmountFormat(amount = '', decimals = 8) {
    const limit = decimals > MaxDecimals ? MaxDecimals : decimals;
    const decimalNum = +decimals ? new RegExp(`^\\d+[.]\\d{1,${ limit }}$`) : null;

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

// errorMap = { overMax, lessMin, notEnough }
export function verifyAmount({ decimals, formatDecimals = 8, balance, minAmount, maxAmount, errorMap }) {
    formatDecimals = getFormatDecimals(decimals, formatDecimals);

    return function (amount) {
        if (!amount) {
            return null;
        }

        const checkMsg = checkAmountFormatMsg(amount, formatDecimals);
        if (checkMsg) {
            return checkMsg;
        }

        return verifyAmountLimit({ decimals, balance, minAmount, maxAmount, errorMap }, amount);
    };
}

export function verifyWithdrawAmount({ stakingAmount, decimals, formatDecimals = 8 }, withdrawAmount) {
    if (!withdrawAmount) {
        return null;
    }

    formatDecimals = getFormatDecimals(decimals, formatDecimals);
    const checkMsg = checkAmountFormatMsg(withdrawAmount, formatDecimals);
    if (checkMsg) {
        return checkMsg;
    }

    const withdrawAmountUnit = BigNumber.toMin(withdrawAmount, decimals);

    // The current staking amount is less than the minimum staking amount.
    if (BigNumber.compared(stakingAmount, minStakingUnit) < 0) {
        return `${ i18n.t('walletQuota.minAmt', { num: MinStakingAmount }) }, ${ i18n.t('walletQuota.gotoStake') }`;
    }

    // The withdraw amount is less than the minimum withdraw amount.
    if (BigNumber.compared(withdrawAmountUnit, minStakingUnit) < 0) {
        return i18n.t('walletQuota.minAmt', { num: MinStakingAmount });
    }

    // The withdraw amount is less than the current staking amount.
    if (BigNumber.compared(stakingAmount, withdrawAmountUnit) < 0) {
        return i18n.t('walletQuota.maxAmt', {
            minAmount: MinStakingAmount,
            maxAmount: BigNumber.toBasic(stakingAmount, decimals)
        });
    }

    // The withdraw amount is bigger than the StakingAmount - MinStakingAmount && not all
    const maxWithdrawAmount = BigNumber.minus(stakingAmount, minStakingUnit, 8, 'nofix');
    if (BigNumber.compared(withdrawAmountUnit, maxWithdrawAmount) > 0
        && BigNumber.compared(stakingAmount, withdrawAmountUnit) !== 0) {
        return i18n.t('walletQuota.cancelLimitAmt', { num: MinStakingAmount });
    }

    return null;
}

export function getValidBalance({ decimals, balance = 0, minNum, maxNum, errorMap }) {
    balance = balance || 0;

    return function (amount) {
        if (!amount) {
            return null;
        }

        if (checkAmountFormat(amount, decimals)) {
            return i18n.t('hint.amtFormat');
        }

        return verifyAmountLimit({ decimals, balance, minAmount: minNum, maxAmount: maxNum, errorMap }, amount);
    };
}


function verifyAmountLimit({ decimals, balance, minAmount, maxAmount, errorMap = {} }, amount) {
    errorMap = errorMap || {};
    amount = BigNumber.toMin(amount, decimals || 0);

    if (maxAmount !== undefined && BigNumber.compared(amount, maxAmount) > 0) {
        return errorMap.overMax;
    }

    if (minAmount !== undefined && BigNumber.compared(amount, minAmount) < 0) {
        return errorMap.lessMin;
    }

    if (balance !== undefined && BigNumber.compared(balance, amount) < 0) {
        return errorMap.notEnough || i18n.t('hint.insufficientBalance');
    }

    if (BigNumber.compared(amount, 0) <= 0) {
        return errorMap.less0 || i18n.t('hint.bigger0');
    }

    return null;
}

function checkAmountFormatMsg(amount, formatDecimals) {
    const checkResult = checkAmountFormat(amount, formatDecimals);

    if (checkResult !== 0) {
        return checkResult === 2
            ? i18n.t('hint.validMaxDigit', { digit: formatDecimals })
            : i18n.t('hint.amtFormat');
    }

    return '';
}

function getFormatDecimals(decimals, formatDecimals = MaxDecimals) {
    // Important: Format check with the smallest number of decimal places
    formatDecimals = formatDecimals > MaxDecimals ? MaxDecimals : formatDecimals;
    if (decimals) {
        formatDecimals = decimals > formatDecimals ? formatDecimals : decimals;
    }
    return formatDecimals;
}
