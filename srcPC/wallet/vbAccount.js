import { accountBlock as accountBlockUtils } from '@vite/vitejs';

import { constant } from 'pcUtils/store';

import { addHdAccount, setAcc, getAcc, setAccInfo, setLastAcc } from './store';

const Default_Lang = 'english';

const StatusMap = {
    LOCK: 0,
    UNLOCK: 1
};

export default class VBAccount {
    constructor({
        id,
        lang,
        name,
        activeAddr
    }) {
        this.id = id || `VITEBIFROST_${ activeAddr }`;
        this.lang = lang || Default_Lang;
        this.name = name || '';
        this.activeAddr = activeAddr;
        this.status = StatusMap.LOCK;
        this.setActiveAcc();
        this.addrList = [{
            address: activeAddr,
            id: this.id,
            idx: 0
        }];

        // Set Addr Num
        this.addrNum = 1;
        this.save();

        this.id.startsWith('VITEBIFROST_') && (this.isBifrost = true);
    }

    get activeAccount() {
        return this._activeAccount;
    }

    save() {
        addHdAccount({
            id: this.id,
            lang: this.lang,
            keystore: 'bifrost'
        });
        this.saveAcc();
    }

    saveAcc() {
        setAcc(this.id, {
            name: this.name,
            addrNum: this.addrNum,
            activeAddr: this.activeAddr,
            activeIdx: this.activeIdx
        });
    }

    activate() {}
    freeze() {}

    saveOnAcc(key, info) {
        if (!this.id) {
            return;
        }
        setAccInfo(this.id, key, info);
    }

    getAccInfo() {
        if (!this.id) {
            return;
        }
        return Object.assign({}, getAcc(this.id), { [constant.HoldPwdKey]: true });
    }

    lock() {
        this.vb && this.vb.destroy();

        this.proxyActiveAcc.sendPowTx = undefined;
        this.status = StatusMap.LOCK;
        this.vb = null;
    }

    setActiveAcc() {
        const proxyActiveAcc = Object.create(null);
        proxyActiveAcc.address = this.activeAddr;
        proxyActiveAcc.isBifrost = true;
        this._activeAccount = {
            isBifrost: true,
            address: this.activeAddr
        };
        this.proxyActiveAcc = proxyActiveAcc;
    }

    unlock(vb) {
        if (!vb) {
            return;
        }
        this.vb = vb;

        const sendPowTx = async ({
            methodName,
            params = [],
            vbExtends,
            abi,
            description
        }) => {
            if (params[0]) {
                params[0].prevHash = 'hack for bifrost';
                params[0].height = 34;
            }

            // accountBlockUtils.createAccountBlock(methodName, )

            const block = await this.activeAccount.getBlock[methodName](params[0], 'sync');
            return vb.sendVbTx({
                block,
                extend: vbExtends,
                abi,
                description
            });
        };

        this.status = StatusMap.UNLOCK;
        this.proxyActiveAcc.sendPowTx = sendPowTx;
        setLastAcc({ id: this.id });
    }
}
