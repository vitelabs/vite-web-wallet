import { constant } from '@pc/utils/store';
import { addHdAccount, setAcc, getAcc, setAccInfo, setLastAcc } from './store';

const Default_Lang = 'english';
enum StatusMap {
    'LOCK' = 0,
    'UNLOCK' = 1
}

export class VPAccount {
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
    isVitePassport: boolean;

    // 用于判断是否私钥是存储在其他地方，例如：硬件钱包和手机钱包里。在多数情况下，两者的表现形式差不多，所以将单独用一个字段来标明
    isSeparateKey: boolean;

    constructor({
        lang,
        name,
        activeAddr
    }) {
        this.id = `VITEPASSPORT_${ activeAddr }`;
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

        this.isVitePassport = true;
        this.isSeparateKey = true;

        // Set Addr Num
        this.addrNum = 1;
        this.save();
    }

    save() {
        addHdAccount({
            id: this.id,
            lang: this.lang,
            keystore: 'vitePassport'
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

    setActiveAcc() {
        this.activeAccount = {
            isVitePassport: true,
            address: this.activeAddr
        };
    }

    async lock() {
        this.status = StatusMap.LOCK;
        await window?.vitePassport.disconnectWallet();
    }

    async unlock() {
        const address = window?.vitePassport.getConnectedAddress();
        if (address) {
            this.status = StatusMap.UNLOCK;
            setLastAcc({ id: this.id });
        }
    }
}