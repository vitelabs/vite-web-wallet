import { getActiveAcc } from 'wallet';
import storage from 'utils/store';

export const addrSpace = {
    get key() {
        return `${ getActiveAcc().address }`;
    },

    getItem(key) {
        const activeAcc = getActiveAcc();
        if (!activeAcc || !activeAcc.address) {
            return null;
        }

        return storage.getItem(`${ this.key }_${ key }`);
    },

    setItem(key, content) {
        const activeAcc = getActiveAcc();
        if (!activeAcc || !activeAcc.address) {
            return null;
        }

        storage.setItem(`${ this.key }_${ key }`, content);
    }
};
