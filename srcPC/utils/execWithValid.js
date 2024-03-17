import { StatusMap, getCurrHDAcc, getActiveAcc } from '@pc/wallet';
import { pwdConfirm } from '@pc/components/password/index.js';
import { vbConnectDialog, hwAddressSelectDialog } from '@pc/components/dialog';

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
        if (currHDACC && currHDACC.isVitePassport) {
            window?.vitePassport.connectWallet();
            return;
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
