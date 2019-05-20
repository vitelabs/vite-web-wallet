import { addrAccount as _addrAccount } from '@vite/vitejs';
import acc from 'utils/storeAcc.js';
import $ViteJS from 'utils/viteClient';

class addrAccount extends _addrAccount {
    constructor({ address, id, entropy }) {
        super({ client: $ViteJS, address });
        this.id = id;
        this.entropy = entropy;
    }

    getDefaultAddr() {
        return this.address;
    }

    save(name) {
        const accList = acc.getList();
        let i;
        for (i = 0; i < accList.length; i++) {
            const acc = accList[i];
            if (acc.id === this.id || acc.entropy === this.entropy || acc.addr === this.address) {
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

