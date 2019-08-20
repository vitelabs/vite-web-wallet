import getDialog from './utils.js';
import tokenInfoComp from './tokenInfo';
import exWithdrawComp from './exWithdraw.vue';
import exChargeComp from './exCharge.vue';

export const tokenInfoDialog = getDialog(tokenInfoComp);
export const exWithdrawDialog = getDialog(exWithdrawComp);
export const exChargeDialog = getDialog(exChargeComp);
