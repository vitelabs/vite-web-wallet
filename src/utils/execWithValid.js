import { StatusMap, getCurrHDAcc, getActiveAcc } from 'wallet';
import { pwdConfirm } from 'components/password/index.js';
import { vbConnectDialog } from 'components/dialog';

export function execWithValid(funcName, noActive) {
    return function (...args) {
        const currHDACC = getCurrHDAcc();
        if (currHDACC.status === StatusMap.UNLOCK) {
            return funcName.call(this, ...args);
        }
        const activeAccount = getActiveAcc();
        if (currHDACC && currHDACC.isBifrost) {
            vbConnectDialog();
            return;
        }
        if (activeAccount) {
            pwdConfirm({ type: 'unlockAccount' });
            return;
        }
        if (noActive) {
            noActive.apply(this);
        }
    };
}
