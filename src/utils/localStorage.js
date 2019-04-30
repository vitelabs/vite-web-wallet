import storage from 'utils/storage';

const walletSpace = 'VITE_WEB_WALLET';

export default {
    setItem(name, data) {
        storage.setItem(getKey(name), data);
    },
    getItem(name, data) {
        return storage.getItem(getKey(name), data);
    }
};


function getKey(name) {
    return `${ walletSpace }:${ name }`;
}
