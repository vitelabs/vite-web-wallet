import { storage, constant } from 'utils/store';

const { getItem, setItem } = storage;
const {
    AccListKey, LastKey, SettingKeys, TradeKeys,
    AccInfoKeys, AddrInfoKeys, AccBaseKeys, AddrBaseKeys
} = constant;


export function addHdAccount({ id, lang, keystore }) {
    let list = getAccList();
    list = list.filter(v => v.id !== id);
    list.unshift({ id, lang, keystore });
    setAccList(list);
}

export function getAccList() {
    const list = getItem(AccListKey) || [];
    return list.map(item => Object.assign(item, getItem(item.id) || {}));
}

export function setAccList(list) {
    setItem(AccListKey, list.filter(item => item.id && item.lang && item.keystore).map(item => {
        return { id: item.id, lang: item.lang, keystore: item.keystore };
    }));
}

export function getLastAcc() {
    const lastId = getItem(LastKey);
    if (!lastId) {
        return null;
    }
    const lastAcc = getAccList().find(v => v.id === lastId);
    return lastAcc && lastAcc.activeAddr ? Object.assign({}, lastAcc, getItem(lastId) || {}) : null;
}

export function setLastAcc(acc) {
    if (!acc || !acc.id) {
        return;
    }
    setItem(LastKey, acc.id);
}

export function getAcc(id) {
    const acc = getItem(id) || {};
    AccInfoKeys.forEach(key => {
        acc[key] = getItem(`${ id }_${ key }`) || null;
    });
    [ 'setting', 'trade' ].forEach(key => {
        acc[key] = getItem(`${ id }_${ key }`) || {};
    });
    return acc;
}

export function setAcc(id, acc) {
    setItem(id, acc);
}

export function setAccInfo(id, infoKey, data) {
    if (AccBaseKeys.indexOf(infoKey) !== -1) {
        const acc = getItem(id) || {};
        acc[infoKey] = data;
        setAcc(id, acc);
        return;
    }

    let key = getCommonInfoKey(infoKey, id);
    if (key) {
        const item = getItem(key) || {};
        item[infoKey] = data;
        setItem(key, item);
        return;
    }

    if (AccInfoKeys.indexOf(infoKey) === -1) {
        throw new Error(`[localStorage] Please add the key ${ infoKey } in utils/store/constant AccInfoKeys.`);
    }

    key = `${ id }_${ infoKey }`;
    setItem(key, data);
}

export function getAddr(addr) {
    const acc = getItem(addr) || {
        name: '',
        id: '',
        idx: ''
    };
    AddrInfoKeys.forEach(key => {
        acc[key] = getItem(`${ addr }_${ key }`) || null;
    });
    [ 'setting', 'trade' ].forEach(key => {
        acc[key] = getItem(`${ addr }_${ key }`) || {};
    });
    return acc;
}

export function setAddr(addr, addrInfo) {
    setItem(addr, {
        name: addrInfo.name,
        idx: addrInfo.idx,
        id: addrInfo.id
    });
}

export function setAddrInfo(addr, infoKey, data) {
    if (AddrBaseKeys.indexOf(infoKey) !== -1) {
        const acc = getItem(addr) || {};
        acc[infoKey] = data;
        setAddr(addr, acc);
        return;
    }

    let key = getCommonInfoKey(infoKey, addr);
    if (key) {
        const item = getItem(key) || {};
        item[infoKey] = data;
        setItem(key, item);
        return;
    }

    if (AddrInfoKeys.indexOf(infoKey) === -1) {
        throw new Error(`[localStorage] Please add the key ${ infoKey } in utils/store/constant AccInfoKeys.`);
    }

    key = `${ addr }_${ infoKey }`;
    setItem(key, data);
}

function getCommonInfoKey(infoKey, id) {
    let key = SettingKeys.indexOf(infoKey) === -1 ? '' : `${ id }_setting` ;
    key = TradeKeys.indexOf(infoKey) === -1 ? '' : `${ id }_trade` ;
    return key;
}
