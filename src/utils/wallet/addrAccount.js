import { addrAccount as _addrAccount } from '@vite/vitejs';

class addrAccount extends _addrAccount {
    constructor({
        address
    }) {
        super({
            client: $ViteJS, address
        });
    }

    getDefaultAddr() {
        return this.address;
    }
}

export default addrAccount;

