import viteCrypto from 'testwebworker';
import { keystore, constant, utils } from '@vite/vitejs';

import { getOldAccList, setOldAccList } from 'pcUtils/store';

import { WebAccount as HDAccount, StatusMap as _StatusMap } from './webAccount';
import VBAccount from './vbAccount';
import { getLastAcc, addHdAccount, setAcc, getAccList } from './store';

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

    if (acc.isBifrost
        && currentHDAccount
        && currentHDAccount.isBifrost
        && currentHDAccount.activeAddr === acc.activeAddr
    ) {
        return currentHDAccount;
    }

    return constructAccount(acc);
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
    return accList
        .concat(oldAccList)
        .filter(acc => acc.id && !acc.id.startsWith('VITEBIFROST_')); // filter vb accounts
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

export function saveHDAccount({
    name,
    pass,
    hdAddrObj,
    lang = LangList.english,
    addrNum = 1
}) {
    const err = checkParams({ name, pass, hdAddrObj, lang }, [
        'name',
        'pass',
        'hdAddrObj',
        'lang'
    ]);
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


function initCurrHDAccount() {
    const lastAcc = getLastAcc();
    if (!lastAcc) {
        return;
    }
    return constructAccount(lastAcc);
}

function constructAccount(acc) {
    if (acc.isBifrost || acc.id.startsWith('VITEBIFROST_')) {
        currentHDAccount = new VBAccount(acc);
    } else {
        currentHDAccount = new HDAccount(acc);
    }
    return currentHDAccount;
}
