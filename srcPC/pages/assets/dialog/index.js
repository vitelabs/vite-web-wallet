import getDialog from '@pc/components/dialog/utils.js';
import depositComp from './deposit.vue';
import addTokenComp from './addToken.vue';
import tokenInfoComp from './tokenInfo/index.vue';
import withdrawComp from './withdraw.vue';

export const depositDialog = getDialog(depositComp);
export const addTokenDialog = getDialog(addTokenComp);
export const tokenInfoDialog = getDialog(tokenInfoComp);
export const withdrawDialog = getDialog(withdrawComp);
