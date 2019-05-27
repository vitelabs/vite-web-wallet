import {
    StatusMap,
    getCurrHDAcc,
    getActiveAcc
} from 'wallet';
import { pwdConfirm } from 'components/password/index.js';

export function execWithValid(funcName) {
    return function (...args) {
        const currHDACC = getCurrHDAcc();
        if (currHDACC.status === StatusMap.UNLOCK) {
            return funcName.apply(this, ...args);
        }
        const activeAccount = getActiveAcc();
        if (activeAccount) {
            pwdConfirm({ type: 'unlockAccount' });
            return;
        }
    };
}
