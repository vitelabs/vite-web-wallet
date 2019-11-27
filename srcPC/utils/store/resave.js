import { wallet, keystore as _keystore } from '@vite/vitejs';

import { setOldAccList, setKeystoreAccList, storage } from './index';

const AccListKey = 'ACC_LIST';
const LastKey = 'ACC_LAST';

export function resaveAccList() {
    const accList = getAccList();
    if (!accList || !accList.length) {
        return;
    }

    let isChange = false;
    const resaveAccList = [];
    const resaveKeystoreAccList = [];
    const oldAccList = [];

    const resaveAccItemList = [];

    const pushResaveAccList = item => {
        let i;
        for (i = 0; i < resaveAccList.length; i++) {
            if (resaveAccList[i].id === item.id) {
                break;
            }
        }
        if (i >= resaveAccList.length) {
            resaveAccList.push(item);
        }
    };

    accList.forEach(item => {
        if (!item) {
            return;
        }

        for (const key in item) {
            isChange = isChange || [ 'id', 'lang', 'keystore' ].indexOf(key) === -1;
        }

        const isKeystoreAcc = !item.id && !item.entropy && item.addr;
        if (isKeystoreAcc) {
            resaveKeystoreAccList.push(item);
            return;
        }

        const resaveAccItem = {
            addrNum: item.addrNum || 1,
            name: item.name || '',
            activeAddr: item.addr || '',
            activeIdx: item.defaultInx || 0
        };

        const isV1Keystore = item.entropy && item.encryptObj && +item.encryptObj.version === 1 && item.encryptObj.scryptParams;
        if (isV1Keystore) {
            // Change to V3 Keystore
            const entropy = item.entropy;
            const mnemonic = wallet.getMnemonicsFromEntropy(entropy);
            const keystore = _keystore.encryptV1ToV3(entropy, JSON.stringify(item.encryptObj));

            const myWallet = wallet.getWallet(mnemonic);
            const id = myWallet.id;

            pushResaveAccList({
                id,
                lang: 'english',
                keystore: JSON.parse(keystore)
            });
            resaveAccItemList.push({ id, resaveAccItem });
            return;
        }

        const id = item.id;

        // Must be decrypt to get id
        if (!id) {
            if (!item.encryptObj) {
                return;
            }

            oldAccList.push({
                name: item.name || '',
                entropy: item.entropy || item.encryptObj.encryptentropy, // !!! Very Very Important !!!!
                idx: item.defaultInx || 0,
                addrNum: item.addrNum || 1,
                keystore: item.encryptObj
            });
            return;
        }

        pushResaveAccList({
            id,
            lang: item.lang || 'english',
            keystore: item.encryptObj
        });
        resaveAccItemList.push({ id, resaveAccItem });
    });

    if (!isChange) {
        return;
    }

    resaveAccItemList.forEach(({ id, resaveAccItem }) => {
        setAcc(id, resaveAccItem);
    });
    oldAccList.length && setOldAccList(oldAccList);
    resaveKeystoreAccList.length && setKeystoreAccList(resaveKeystoreAccList);
    setAccList(resaveAccList);
}

export function resaveLastAcc() {
    const lastAcc = getLastAcc();
    if (!lastAcc || !lastAcc.id) {
        return;
    }
    setLastAcc(lastAcc.id);
}


function getAccList() {
    return storage.getItem(AccListKey);
}
function setAccList(accList) {
    storage.setItem(AccListKey, accList);
}

function getLastAcc() {
    return storage.getItem(LastKey);
}
function setLastAcc(id) {
    storage.setItem(LastKey, id);
}

function setAcc(id, acc) {
    storage.setItem(id, acc);
}
