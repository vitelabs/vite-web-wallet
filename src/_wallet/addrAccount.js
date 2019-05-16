import { addrAccount as _addrAccount } from '@vite/vitejs';
import { getAccList } from 'utils/store';
import acc from 'utils/storeAcc.js';
import $ViteJS from 'utils/viteClient';

class addrAccount extends _addrAccount {
    constructor({ address, id }) {
        super({ client: $ViteJS, address });
        this.id = id;
    }

    getDefaultAddr() {
        return this.address;
    }

    save(name) {
        const accList = getAccList();
        let i;
        for (i = 0; i < accList.length; i++) {
            const acc = accList[i];
            if (acc.id === this.id || acc.addr === this.address) {
                break;
            }
        }
        if (i >= accList.length) {
            return;
        }

        accList[i].name = name;
        acc.add(accList[i]);
    }
}

export default addrAccount;

