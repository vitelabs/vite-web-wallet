import storage from 'utils/localStorage.js';

const LAST_KEY = 'ACC_LAST';

export default {
    getLast() {
        return storage.getItem(LAST_KEY);
    },
    setLast(acc) {
        storage.setItem(LAST_KEY, acc);
    }
};
