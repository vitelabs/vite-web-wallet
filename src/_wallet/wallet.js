import { keystore, utils, constant, hdAddr } from '@vite/vitejs';
import vitecrypto from 'testwebworker';
import statistics from 'utils/statistics';
import { getAccList, getOldAccList, getLastAcc, setAcc, setAccList } from 'utils/store';

const { checkParams } = utils;
const { LangList } = constant;


export function getList() {
    const accList = getAccList() || [];
    const oldAccList = getOldAccList() || [];
    return accList.concat(oldAccList);
}

export function getLast() {
    const lastAcc = getLastAcc();
    console.log(lastAcc);
}

export async function decryptWalletAccount(keystoreObj, pass, lang = LangList.english) {
    const before = new Date().getTime();
    const entropy = await keystore.decrypt(JSON.stringify(keystoreObj), pass, vitecrypto);
    const after = new Date().getTime();
    statistics.event('mnemonic-decrypt', keystoreObj.version || '1', 'time', after - before);
    return hdAddr.getMnemonicFromEntropy(entropy, lang);
}

export function saveWalletAccount({ name, pass, addrObj, lang = LangList.english }) {
    const err = checkParams({ name, pass, addrObj, lang }, [ 'name', 'pass', 'addrObj', 'lang' ]);
    if (err) {
        throw err;
    }

    const { addr, entropy, id } = addrObj;

    return keystore.encrypt(entropy, pass, null, vitecrypto).then(keystoreStr => {
        const keystoreObj = JSON.parse(keystoreStr);

        addWalletAccount({
            id,
            lang,
            keystore: keystoreObj
        });
        setAcc(id, {
            name,
            addrNum: 1,
            addr: addr.hexAddr,
            idx: 0
        });
        return id;
    });
}


function addWalletAccount({ id, lang, keystore }) {
    const list = getAccList();

    let i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            break;
        }
    }

    if (i < list.length) {
        list.splice(i, 1);
    }

    list.push({ id, lang, keystore });
    setAccList(list);
}
