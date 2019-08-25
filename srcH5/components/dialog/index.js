import baseComp from 'components/dialog/base.vue';
import getDialog from './getDialog';
import receiveInviteComp from './receiveInvite.vue';

export const receiveInviteDialog = getDialog(receiveInviteComp);
export const baseDialog = getDialog(baseComp);
