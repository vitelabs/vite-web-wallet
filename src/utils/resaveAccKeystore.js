import { hdAddr as _hdAddr, keystore as _keystore, constant } from '@vite/vitejs';
import acc from 'utils/storeAcc.js';
import statistics from 'utils/statistics';
import storage from 'utils/localStorage.js';

const { LangList } = constant;
const LAST_KEY = 'ACC_LAST';

export default function () {
    const list = acc.getList();
    if (!list || !list.length) {
        return;
    }

    const last = getLast();
    const reList = [];
    let isChange = false;

    list.forEach(item => {
        if (!item) {
            return;
        }

        if (!item.entropy || !item.encryptObj || +item.encryptObj.version !== 1 || !item.encryptObj.scryptParams) {
            reList.push(item);

            return;
        }

        isChange = true;

        const entropy = item.entropy;
        let keystore = _keystore.encryptV1ToV3(entropy, JSON.stringify(item.encryptObj));

        keystore = JSON.parse(keystore);

        const mnemonic = _hdAddr.getMnemonicFromEntropy(entropy);
        item.lang = LangList.english;
        item.id = _hdAddr.getId(mnemonic);
        item.encryptObj = keystore;

        if (last && last.entropy && last.entropy === entropy) {
            last.entropy = item.entropy;
        }
        reList.push(item);
    });

    if (!isChange) {
        return;
    }

    statistics.event('keystore', 'resave');
    setLast(last);
    acc.setAccList(reList);
}


function getLast() {
    return storage.getItem(LAST_KEY);
}

function setLast(acc) {
    storage.setItem(LAST_KEY, acc);
}
