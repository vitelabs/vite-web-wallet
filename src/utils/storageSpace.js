import { wallet } from 'utils/wallet';
import storage from 'utils/localStorage';

export const addrSpace = {
    get key() {
        return `${ wallet.defaultAddr }`;
    },

    getItem(key) {
        if (!wallet.defaultAddr) {
            return null;
        }

        return storage.getItem(`${ this.key }_${ key }`);
    },

    setItem(key, content) {
        if (!wallet.defaultAddr) {
            return;
        }

        storage.setItem(`${ this.key }_${ key }`, content);
    }
};
