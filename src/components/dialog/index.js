import baseComp from './base.vue';
import vbConfirmComp from './vbConfirm.vue';
import vbConnectComp from './vbConnect.vue';
import getDialog from './utils.js';

export const baseDialog = getDialog(baseComp);
export const vbConfirmDialog = getDialog(vbConfirmComp);
export const vbConnectDialog = getDialog(vbConnectComp);
