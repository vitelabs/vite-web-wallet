const walletSpace = 'VITE_WEB_WALLET';
const storage = window.localStorage;

export default {
    setItem(name, data) {
        let key = `${walletSpace}:${name}`;
        storage.setItem(key, JSON.stringify(data));
    },
    getItem
};

function getItem(name) {
    let key = `${walletSpace}:${name}`;
    try {
        let data = storage.getItem(key);
        if (!data) {
            return null;
        }

        return JSON.parse(data);
    } catch(err) {
        console.error(err);
        return null;
    }
}
