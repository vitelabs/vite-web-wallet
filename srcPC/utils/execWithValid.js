import { StatusMap, getCurrHDAcc, getActiveAcc } from 'wallet';
import { pwdConfirm } from 'pcComponents/password/index.js';
import { vbConnectDialog, hwAddressSelectDialog } from 'pcComponents/dialog';

export function execWithValid(funcName, noActive) {
    return function (...args) {
        const currHDACC = getCurrHDAcc();

        if (currHDACC && currHDACC.status === StatusMap.UNLOCK) {
            return funcName.call(this, ...args);
        }
        const activeAccount = getActiveAcc();
        if (currHDACC && currHDACC.isBifrost) {
            vbConnectDialog();
            return Promise.reject({ error: { code: 12001 } });
        }
        if (currHDACC && currHDACC.isHardware) {
            hwAddressSelectDialog();
            return Promise.reject({ error: { code: 12001 } });
        }
        if (activeAccount) {
            pwdConfirm({ type: 'unlockAccount' });
            return Promise.reject({ error: { code: 12001 } });
        }
        if (noActive) {
            noActive.apply(this);
            return Promise.reject({ error: { code: 12002 } });
        }
    };
}
