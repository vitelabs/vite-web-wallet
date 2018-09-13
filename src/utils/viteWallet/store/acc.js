import storage from 'utils/localStorage.js';

const ACC_KEY = 'ACC_LIST';
const NAME_KEY = 'NAME_COUNT';

export default {
    getList,
    add(account) {
        if (!account.addr && !account.entropy) {
            return;
        }

        let data = getList() || [];
        let i;
        for(i=0; i<data.length; i++) {
            let acc = data[i];
            if ((acc.entropy && account.entropy && account.entropy === acc.entropy) || 
                (acc.addr && account.addr && account.addr === acc.addr)) {
                data[i] = account;
                break;
            }
        }

        i >= data.length && data.push(account);
        storage.setItem(ACC_KEY, data);
    },
    setAccList(accounts) {
        storage.setItem(ACC_KEY, accounts);
    },
    setNameCount(count) {
        storage.setItem(NAME_KEY, count);
    },
    getNameCount() {
        return storage.getItem(NAME_KEY) || 0;
    }
};

function getList() {
    return storage.getItem(ACC_KEY);
}

// import storage from 'utils/localStorage.js';

// const ACC_NAME_KEY = 'ACC_NAME';

// export default {
//     getAccNames() {
//         let defaultObj = {
//             namesMap: {},
//             nameCount: 0
//         };

//         let data = storage.getItem(ACC_NAME_KEY);
//         if (!data) {
//             return defaultObj;
//         }

//         return data || defaultObj;
//     },
//     setAccNames(namesMap, nameCount, lastLoginAccount) {
//         storage.setItem(ACC_NAME_KEY, {
//             namesMap, nameCount, lastLoginAccount
//         });
//     }
// };

