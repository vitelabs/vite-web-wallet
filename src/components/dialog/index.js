import baseComp from './base.vue';
import vbConfirmComp from './vbConfirm.vue';
import vbConnectComp from './vbConnect.vue';
import getDialog from './utils.js';
import inviteComp from './invite.vue';
import receiveInviteComp from './receiveInvite.vue';

export const inviteDialog = getDialog(inviteComp);
export const receiveInviteDialog = getDialog(receiveInviteComp);
export const baseDialog = getDialog(baseComp);
export const vbConfirmDialog = getDialog(vbConfirmComp);
export const vbConnectDialog = getDialog(vbConnectComp);
