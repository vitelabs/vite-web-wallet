import { StatusMap, getCurrHDAcc, getActiveAcc } from 'wallet';
import { pwdConfirm } from 'components/password/index.js';

export function execWithValid(funcName, noActive) {
    return function (...args) {
        const currHDACC = getCurrHDAcc();
        if (currHDACC.status === StatusMap.UNLOCK) {
            return funcName.call(this, ...args);
        }
        const activeAccount = getActiveAcc();
        if (activeAccount) {
            pwdConfirm({ type: 'unlockAccount' });
            return;
        }
        if (noActive) {
            noActive.apply(this);
        }
    };
}
