import storage from 'utils/localStorage.js';

const ACC_KEY = 'ACC_LIST';
const LAST_KEY = 'ACC_LAST';
const NAME_KEY = 'NAME_COUNT';

export default {
    getList,
    add(account, index = -1) {
        if (!account.addr && !account.entropy && !account.id) {
            return;
        }

        const data = getList() || [];
        if (index > -1 && index < data.length) {
            data.splice(index, 1);
        }

        let i;
        const saveList = [];
        let saveIndex = -1;

        const pushWalletAcc = acc => {
            if (saveIndex === -1) {
                saveIndex = saveList.length;
                saveList.push(acc);

                return;
            }

            const saveAcc = saveList[saveIndex];
            acc.addrNum = acc.addrNum >= saveAcc.addrNum ? acc.addrNum : saveAcc.addrNum;
            saveList[saveIndex] = acc;
        };

        for (i = 0; i < data.length; i++) {
            const acc = data[i];

            // Wallet account repeat
            if ((acc.id && account.id && account.id === acc.id)
                || (acc.entropy && account.entropy && account.entropy === acc.entropy)) {
                account.addrNum = account.addrNum >= acc.addrNum ? account.addrNum : acc.addrNum;
                pushWalletAcc(account);
            } else if (acc.addr && account.addr && account.addr === acc.addr) {
                if (saveIndex === -1) {
                    saveIndex = saveList.length;
                    saveList.push(account);
                } else {
                    saveList[saveIndex] = account;
                }
            } else {
                saveList.push(acc);
            }
        }

        (saveIndex === -1) && saveList.push(account);
        storage.setItem(ACC_KEY, saveList);
    },
    setAccList(accounts) {
        storage.setItem(ACC_KEY, accounts);
    },
    setNameCount(count) {
        storage.setItem(NAME_KEY, count);
    },
    getNameCount() {
    },
    getLast() {
        return storage.getItem(LAST_KEY);
    },
    setLast(acc) {
        storage.setItem(LAST_KEY, acc);
    }
};


function getList() {
    return storage.getItem(ACC_KEY);
}
