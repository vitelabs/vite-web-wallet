import { constant } from 'pcUtils/store';

import { addHdAccount, setAcc, getAcc, setAccInfo, setLastAcc } from './store';

const Default_Lang = 'english';
enum StatusMap {
    'LOCK' = 0,
    'UNLOCK' = 1
}

export class VBAccount {
    id: string;
    lang: string;
    status: StatusMap;
    name: string;
    addrNum: number;
    activeIdx: number;
    activeAddr: string;
    addrList: any[];
    vb: any;
    activeAccount: any;
    isBifrost: boolean;

    constructor({
        lang,
        name,
        activeAddr
    }) {
        this.id = `VITEBIFROST_${ activeAddr }`;
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

        this.isBifrost = true;

        // Set Addr Num
        this.addrNum = 1;
        this.save();
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
        this.status = StatusMap.LOCK;
        this.vb = null;
    }

    setActiveAcc() {
        this.activeAccount = {
            isBifrost: true,
            address: this.activeAddr
        };
    }

    unlock(vb) {
        if (!vb) {
            return;
        }

        this.vb = vb;
        this.status = StatusMap.UNLOCK;
        setLastAcc({ id: this.id });
    }
}
