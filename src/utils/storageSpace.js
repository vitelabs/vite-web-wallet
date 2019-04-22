const spaceKey = 'viteStorageSpace';
import { wallet } from 'utils/wallet';

export const addrSpace = {
    get key() {
        return `${ spaceKey }_${ wallet.defaultAddr }`;
    },

    getItem(key) {
        if (!wallet.defaultAddr) throw 'no defaultAddr';
        const content = localStorage.getItem(`${ this.key }_${ key }`);
        if (!content) return null;
        let parseRes = '';
        try {
            parseRes = JSON.parse(content);
        } catch (e) {
            return content;
        }
        return parseRes;
    },

    setItem(key, content) {
        if (!wallet.defaultAddr) throw 'no defaultAddr';
        content = typeof content === 'string' ? content : JSON.stringify(content);
        localStorage.setItem(`${ this.key }_${ key }`, content);
    }
};


