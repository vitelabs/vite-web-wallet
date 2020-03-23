import { constant } from 'pcUtils/store';
import { accountBlock as accountBlockUtils, accountBlock } from '@vite/vitejs';
import { viteClient } from 'services/apiServer';

import { addHdAccount, setAcc, getAcc, setAccInfo, setLastAcc } from './store';
import toast from 'components/toast/index.js';
import i18n from 'pcI18n';

const Default_Lang = 'english';
enum StatusMap {
    'LOCK' = 0,
    'UNLOCK' = 1
}

export class HWAccount {
    id: string;
    lang: string;
    status: StatusMap;
    name: string;
    addrNum: number;
    activeIdx: number;
    activeAddr: string;
    addrList: any[];
    hw: any;
    activeAccount: any;
    isHardware: boolean;
    private receiveTask: any;

    // 用于判断是否私钥是存储在其他地方，例如：硬件钱包和手机钱包里。在多数情况下，两者的表现形式差不多，所以将单独用一个字段来标明
    isSeparateKey: boolean;

    // 存储硬件钱包返回的公钥
    publicKey: string;

    constructor({
        lang,
        name,
        activeAddr,
        activeIdx = 0,
        publicKey
    }) {
        this.id = `VITEHARDWARE_${ activeAddr }`;
        this.lang = lang || Default_Lang;
        this.name = name || '';
        this.activeAddr = activeAddr;
        this.status = StatusMap.LOCK;

        this.isHardware = true;
        this.activeIdx = activeIdx;
        this.isSeparateKey = true;
        this.publicKey = publicKey;


        this.setActiveAcc(activeIdx, activeAddr, publicKey);
        this.addrList = [{
            address: activeAddr,
            id: this.id,
            idx: 0
        }];

        // Set Addr Num
        this.addrNum = 1;
        this.save();
    }

    save() {
        addHdAccount({
            id: this.id,
            lang: this.lang,
            keystore: 'hardware'
        });
        this.saveAcc();
    }

    saveAcc() {
        setAcc(this.id, {
            name: this.name,
            addrNum: this.addrNum,
            activeAddr: this.activeAddr,
            activeIdx: this.activeIdx,
            isHardware: this.isHardware,
            isSeparateKey: this.isSeparateKey
        });
    }

    activate() {
        if (this.status === StatusMap.LOCK || !this.activeAccount) {
            return;
        }

        this.freeze();

        this.receiveTask = new accountBlockUtils.ReceiveAccountBlockTask({
            address: this.activeAccount.address,
            provider: viteClient,
            sign: async _accountBlock => {
                if (!this.hw) return;
                try {
                    const { signature } = await this.hw.signHwTx(this.activeIdx, _accountBlock);
                    _accountBlock.setPublicKey(this.publicKey);
                    _accountBlock.setSignature(signature);
                } catch (err) {
                    console.log(err);
                }
            }
        });
        this.receiveTask.onSuccess(({ message, accountBlockList }) => {
            console.log(message);
            if (accountBlockList && accountBlockList.length) {
                toast(i18n.t('assets.ledger.connect.receiveBlockSuccess', { num: accountBlockList.length }));
            }
        });
        this.receiveTask.start();
        return;
    }

    freeze() {
        // Kill auto receive
        this.receiveTask && this.receiveTask.stop();
        this.receiveTask = null;
    }

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
        this.freeze();
        this.hw && this.hw.destroy();
        this.status = StatusMap.LOCK;
        this.hw = null;
    }

    switchActiveAcc(index, address, publicKey) {
        if (this.status === StatusMap.LOCK) {
            return;
        }
        this.freeze();
        this.setActiveAcc(index, address, publicKey);
        this.activate();
    }

    setActiveAcc(activeIdx, activeAddr, publicKey) {
        this.activeIdx = activeIdx;
        this.activeAddr = activeAddr;
        this.publicKey = publicKey;

        this.activeAccount = {
            isHardware: true,
            address: activeAddr,
            isSeparateKey: true,
            publicKey
        };
    }

    unlock(hw) {
        if (!hw) {
            return;
        }

        this.hw = hw;
        this.status = StatusMap.UNLOCK;
        setLastAcc({ id: this.id });
    }
}
