import getDialog from 'pcComponents/dialog/utils';
import keyConfirmComp from './keyConfirm.vue';
import stakingComp from './staking.vue';
import upgradeComp from './upgrade.vue';

export const keyConfirmDialog = getDialog(keyConfirmComp);
export const stakingDialog = getDialog(stakingComp);
export const upgradeDialog = getDialog(upgradeComp);
