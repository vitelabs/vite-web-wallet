import getDialog from 'components/dialog/utils.js';
import receiveComp from './receive.vue';
import chargeComp from './charge.vue';
import addTokenComp from './addToken.vue';
import tokenInfoComp from './tokenInfo.vue';
import withdrawComp from './withdraw.vue';

export const receiveDialog = getDialog(receiveComp, { showBottom: false });
export const chargeDialog = getDialog(chargeComp, { showBottom: false });
export const addTokenDialog = getDialog(addTokenComp);
export const tokenInfoDialog = getDialog(tokenInfoComp);
export const withdrawDialog = getDialog(withdrawComp);
