import getDialog from 'h5Components/dialog/getDialog.js';
import tokenInfoComp from 'h5Components/tokenInfo';
import exWithdrawComp from './exWithdraw.vue';
import exChargeComp from './exCharge.vue';

export const tokenInfoDialog = getDialog(tokenInfoComp);
export const exWithdrawDialog = getDialog(exWithdrawComp);
export const exChargeDialog = getDialog(exChargeComp);
