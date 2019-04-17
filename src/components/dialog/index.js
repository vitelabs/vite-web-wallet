import baseComp from './base.vue';
import getDialog from './utils.js';
import receiveComp from './receive.vue';
import chargeComp from './charge.vue';

export const receiveDialog = getDialog(receiveComp, { showBottom: false });
export const chargeDialog = getDialog(chargeComp, { showBottom: false });
export const baseDialog = getDialog(baseComp);
