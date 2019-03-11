import { addrAccount as _addrAccount } from '@vite/vitejs';

class addrAccount extends _addrAccount {
    constructor({
        address, id, entropy
    }) {
        super({
            client: $ViteJS, address
        });
        this.id = id;
        this.entropy = entropy;
    }

    getDefaultAddr() {
        return this.address;
    }
}

export default addrAccount;

