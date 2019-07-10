import { keystore, constant, utils } from '@vite/vitejs';
import viteCrypto from 'testwebworker';
import { getOldAccList, setOldAccList } from 'utils/store';
import { HDAccount, StatusMap as _StatusMap, VBAccount } from './hdAccount';
import { getLastAcc, addHdAccount, setAcc, getAccList } from './store';
function constructAccount(acc) {
    if (acc.isBifrost || acc.id.startsWith('VITEBIRFORST_')) {
        currentHDAccount = new VBAccount(acc);
    } else {
        currentHDAccount = new HDAccount(acc);
    }
    return currentHDAccount;
}
const { LangList } = constant;
const { checkParams } = utils;

let currentHDAccount = null;

initCurrHDAccount();

export const StatusMap = _StatusMap;

export function getCurrHDAcc() {
    return currentHDAccount;
}

export function setCurrHDAcc(acc) {
    if (!acc) {
        return;
    }
    if (acc.isBifrost && currentHDAccount && currentHDAccount.activeAddr === acc.activeAddr) {
        return currentHDAccount;
    }
    if (acc.isBifrost || !acc.id || !currentHDAccount || currentHDAccount.id !== acc.id) {
        return constructAccount(acc);
    }
    return currentHDAccount;
}

export function getActiveAcc() {
    if (!currentHDAccount) {
        return null;
    }
    return currentHDAccount.activeAccount;
}

export function getList() {
    const accList = getAccList() || [];
    const oldAccList = getOldAccList() || [];
    return accList.concat(oldAccList).filter(acc => acc.id && !acc.id.startsWith('VITEBIRFORST_'));// filter vb accounts
}

export function deleteOldAcc(acc) {
    const oldAccList = getOldAccList() || [];
    if (oldAccList.length === 0) {
        return;
    }

    let i;
    for (i = 0; i < oldAccList.length; i++) {
        if (oldAccList[i].entropy === acc.entropy) {
            break;
        }
    }

    if (i >= oldAccList.length) {
        return;
    }

    oldAccList.splice(i, 1);
    setOldAccList(oldAccList);
}

export function saveHDAccount({ name, pass, hdAddrObj, lang = LangList.english, addrNum = 1 }) {
    const err = checkParams({ name, pass, hdAddrObj, lang }, [ 'name', 'pass', 'hdAddrObj', 'lang' ]);
    if (err) {
        throw err;
    }

    const { addr, entropy, id } = hdAddrObj;

    return keystore.encrypt(entropy, pass, null, viteCrypto).then(keystoreStr => {
        const keystoreObj = JSON.parse(keystoreStr);

        addHdAccount({
            id,
            lang,
            keystore: keystoreObj
        });
        setAcc(id, {
            name,
            addrNum,
            activeAddr: addr.hexAddr,
            activeIdx: 0
        });
        return id;
    });
}
// export function saveVBAccount({id,addr,lang,name=""}){
//     setAcc(id, {
//         name,
//         addrNum=1,
//         activeAddr: addr,
//         activeIdx: 0
//     });
//     addHdAccount({
//         id,
//         lang,
//         keystore: {}
//     })
// }

function initCurrHDAccount() {
    const lastAcc = getLastAcc();
    if (!lastAcc) {
        return;
    }
    return constructAccount(lastAcc);
}
