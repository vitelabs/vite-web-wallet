import toast from 'utils/toast/index.js';

const walletSpace = 'VITE_WEB_WALLET';
const storage = window.localStorage;

export default {
    setItem(name, data) {
        let key = `${walletSpace}:${name}`;
        try {
            storage.setItem(key, JSON.stringify(data));
            window.viteWalletStorage && window.viteWalletStorage.setItem(key, JSON.stringify(data));
        } catch(err) {
            toast('Store fail!');
            console.error(err);
        }
    },
    getItem
};

function getItem(name) {
    let key = `${walletSpace}:${name}`;
    try {
        let data = storage.getItem(key);

        if (!data && window.viteWalletStorage) {
            data = window.viteWalletStorage.getItem(key);
        }

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    } catch(err) {
        toast('Get from storage fail!');
        console.error(err);
        return null;
    }
}
