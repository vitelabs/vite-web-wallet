import { getActiveAcc } from 'wallet';
import storage from 'utils/store';

export const addrSpace = {
    get key() {
        return `${ getActiveAcc().address }`;
    },

    getItem(key) {
        if (!getActiveAcc().address) {
            return null;
        }

        return storage.getItem(`${ this.key }_${ key }`);
    },

    setItem(key, content) {
        if (!getActiveAcc().address) {
            return;
        }

        storage.setItem(`${ this.key }_${ key }`, content);
    }
};
