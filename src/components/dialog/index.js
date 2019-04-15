import baseComp from './base.vue';
import getDialog from './base.js';
import passwordComp from './password.vue';

export const password = getDialog(passwordComp);
export const base = getDialog(baseComp);
