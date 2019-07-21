import getDialog from 'components/dialog/utils.js';
import receiveComp from './receive.vue';
import chargeComp from './charge.vue';
import addTokenComp from './addToken.vue';
import tokenInfoComp from './tokenInfo';
import withdrawComp from './withdraw.vue';
import exWithdrawComp from './exWithdraw.vue';
import exChargeComp from './exCharge.vue';

export const receiveDialog = getDialog(receiveComp);
export const chargeDialog = getDialog(chargeComp);
export const addTokenDialog = getDialog(addTokenComp);
export const tokenInfoDialog = getDialog(tokenInfoComp);
export const withdrawDialog = getDialog(withdrawComp);
export const exWithdrawDialog = getDialog(exWithdrawComp);
export const exChargeDialog = getDialog(exChargeComp);
