import getDialog from 'pcComponents/dialog/utils';
import addComp from './add.vue';
import confirmComp from './confirm.vue';

export const addDialog = getDialog(addComp);
export const confirmDialog = getDialog(confirmComp);
