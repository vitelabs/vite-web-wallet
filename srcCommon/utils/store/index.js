
import * as _constant from './constant';

const localStorage = window.viteWalletStorage || window.localStorage;
const { WalletSpace, OldAccList, KeystoreAccList, VersionKey } = _constant;

export function setVersion(v) {
    setItem(VersionKey, v);
}

export function getVersion() {
    return getItem(VersionKey);
}

export const constant = _constant;

export const storage = {
    setItem: function (key, data) {
        // if (SettingKeys.indexOf(key) === -1 && TradeKeys.indexOf(key) === -1) {
        //     throw new Error(`[localStorage] Please add the key ${ key } in utils/store/constant(SettingKeys | TradeKeys)`);
        // }
        setItem(key, data);
    },
    getItem: function (key) {
        // if (SettingKeys.indexOf(key) === -1 && TradeKeys.indexOf(key) === -1) {
        //     throw new Error(`[localStorage] Please add the key ${ key } in utils/store/constant(SettingKeys | TradeKeys)`);
        // }
        return getItem(key);
    }
};

export default storage;


// ========= [TODO] Delete Resave ================
export function getOldAccList() {
    return getItem(OldAccList);
}

export function setOldAccList(list) {
    setItem(OldAccList, list);
}

export function getKeystoreAccList() {
    return getItem(KeystoreAccList);
}

export function setKeystoreAccList(list) {
    setItem(KeystoreAccList, list);
}
// =======================================


function getKey(name) {
    return `${ WalletSpace }:${ name }`;
}

function setItem(key, data) {
    const saveData = typeof data === 'string' ? data : JSON.stringify(data);

    try {
        localStorage.setItem(getKey(key), saveData);
    } catch (err) {
        console.error(err);
    }
}

function getItem(key) {
    let data;

    try {
        data = localStorage.getItem(getKey(key));
    } catch (err) {
        console.error(err);
        return null;
    }

    if (!data) {
        return null;
    }

    try {
        data = JSON.parse(data);
        return data;
    } catch (err) {
        return data;
    }
}
