const storage = window.viteWalletStorage || window.localStorage;
const walletSpace = 'VITE_WEB_WALLET';

export default {
    setItem(key, data) {
        const saveData = typeof data === 'string' ? data : JSON.stringify(data);

        try {
            storage.setItem(getKey(key), saveData);
        } catch (err) {
            console.error(err);
        }
    },
    getItem
};

function getKey(name) {
    return `${ walletSpace }:${ name }`;
}

function getItem(key) {
    key = getKey(key);
    let data;

    try {
        data = storage.getItem(key);
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
