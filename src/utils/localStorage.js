import toast from 'utils/toast/index.js';

const walletSpace = 'VITE_WEB_WALLET';
const storage = window.localStorage;

export default {
    setItem(name, data) {
        let key = `${walletSpace}:${name}`;
        console.log(key);
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
    console.log(key);

    try {
        let data;

        if (window.viteWalletStorage) {
            data = window.viteWalletStorage.getItem(key);
        } else {
            data = storage.getItem(key);
        }

        console.log(data);

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
