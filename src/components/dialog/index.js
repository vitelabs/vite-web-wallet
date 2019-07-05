import baseComp from './base.vue';
import vbComp from './vb.vue';
import getDialog from './utils.js';

export const baseDialog = getDialog(baseComp);
export const vbDialog = getDialog(vbComp);
