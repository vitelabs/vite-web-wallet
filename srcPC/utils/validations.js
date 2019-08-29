import numChecker from 'utils/numChecker';
import i18n from 'pcI18n';

const numCheckerInstance = new numChecker(i18n);

export const checkAmountFormat = numCheckerInstance.checkAmountFormat.bind(numCheckerInstance);
export const verifyAmount = numCheckerInstance.verifyAmount.bind(numCheckerInstance);
export const verifyWithdrawAmount = numCheckerInstance.verifyWithdrawAmount.bind(numCheckerInstance);
export const getValidBalance = numCheckerInstance.getValidBalance.bind(numCheckerInstance);
