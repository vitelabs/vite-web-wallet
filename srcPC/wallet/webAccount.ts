// typings/common

import { StatusMap } from 'typings/common';

import viteCrypto from 'testwebworker';
import { keystore, wallet } from '@vite/vitejs';

import statistics from 'utils/statistics';
import { viteClient } from 'services/apiServer';

import { getAddr, addHdAccount, setAcc, getAcc, setAccInfo, setAddr, setLastAcc } from './store';

const Default_Lang = 'english';
const Max_Addr_Num = 10;


export class WebAccount {
    id: string;
    lang: string;
    keystore;
    status: StatusMap;
    name: string;
    addrNum: number;
    activeIdx: number;
    mnemonic: string;
    pass: string;
    activeAddr: string;
    addrList: any[];

    activeAccount: any;


    constructor({
        id,
        lang,
        keystore,
        name = '',
        addrNum = 1,
        activeAddr,
        activeIdx
    }: {
        id: string,
        lang: string,
        keystore,
        name?: string,
        addrNum?: number,
        activeAddr: string,
        activeIdx: number
    }) {
        this.status = StatusMap.LOCK;

        this.id = id;
        this.keystore = keystore;
        this.lang = lang || Default_Lang;
        this.name = name || '';

        // Set Active (Addr Idx Account)
        this.setActiveAcc(activeIdx, activeAddr);

        // Set Addr Num
        addrNum = addrNum || 1;
        this.addrNum = this.activeIdx + 1 > addrNum ? this.activeIdx + 1 : addrNum;

        // Set Addr List
        this.setAddrList();

        this.mnemonic = '';
        this.pass = '';
    }

    save() {
        addHdAccount({
            id: this.id,
            lang: this.lang,
            keystore: this.keystore
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
        return getAcc(this.id);
    }

    verify(pass) {
        if (!this.pass) {
            return this.unlock(pass);
        }
        if (this.pass === pass) {
            return Promise.resolve();
        }
        return Promise.reject();
    }

    async unlock(pass) {
        const before = new Date().getTime();
        const entropy: any = await keystore.decrypt(JSON.stringify(this.keystore), pass, viteCrypto);
        const after = new Date().getTime();

        statistics.event('mnemonic-decrypt', this.keystore.version, 'time', after - before);

        // Set Base Info
        this.status = StatusMap.UNLOCK;
        this.pass = pass;
        this.mnemonic = wallet.getMnemonicsFromEntropy(entropy);

        const myWallet = wallet.getWallet(this.mnemonic);
        this.id = myWallet.id;

        setLastAcc(this);

        // Set Addr List
        this.setAddrList();

        // Set Active (Addr, ActiveAccount)
        if (this.activeAddr) {
            this.setActiveAcc(null, this.activeAddr);
        } else {
            this.setActiveAcc(this.activeIdx);
        }

        this.save();
        return this.activeAccount;
    }

    lock() {
        this.status = StatusMap.LOCK;
        this.pass = '';
        this.mnemonic = '';
        this.activeAccount && (this.activeAccount.privateKey = null);
        this.setAddrList();
    }

    // [TODO]
    activate() {
        if (this.status === StatusMap.LOCK || !this.activeAccount) {
            return;
        }

        // auto receive tx
        // this.activeAccount.activate(2000, true, true);
        // return this.activeAccount;
    }

    // [TODO]
    freeze() {
        if (!this.activeAccount) {
            return;
        }

        // kill auto receive
        this.activeAccount.freeze();
    }

    addAddr() {
        if (this.status === StatusMap.LOCK) {
            return null;
        }

        const index = this.addrList.length;
        if (index >= Max_Addr_Num) {
            return null;
        }

        const myWallet = wallet.getWallet(this.mnemonic);
        const addrObj = myWallet.deriveAddress(index);
        const _addrObj = {
            ...addrObj,
            idx: index,
            id: this.id
        };

        this.addrList.push(_addrObj);
        this.addrNum = this.addrList.length;
        this.saveAcc();
        return _addrObj;
    }

    rename(name) {
        this.name = name;
        this.saveAcc();
    }

    changeAddrName(name, index, address) {
        const addrObj = this.getAddrObj(index, address);
        if (!addrObj) {
            return;
        }

        addrObj.name = name;
        setAddr(addrObj.address, addrObj);
    }

    switchActiveAcc(index, address) {
        if (this.status === StatusMap.LOCK) {
            return;
        }
        this.freeze();
        this.setActiveAcc(index, address);
        this.saveAcc();
        this.activate();
    }

    setActiveAcc(index?, address?) {
        if (this.status === StatusMap.LOCK) {
            this.activeIdx = index || 0;
            this.activeAddr = address || '';

            if (!this.activeAddr) {
                this.activeAccount = null;
                return;
            }

            this.activeAccount = {
                isBifrost: false,
                address: this.activeAddr
            };
            return;
        }

        const addrObj = this.getAddrObj(index, address);
        if (!addrObj) {
            return;
        }

        this.activeAddr = addrObj.address;
        this.activeIdx = addrObj.idx;
        const privateKey = addrObj.privKey;

        if (this.activeAccount && this.activeAccount.address === this.activeAddr) {
            !this.activeAccount.privateKey
                && this.activeAccount.setPrivateKey(privateKey);
            return;
        }

        this.activeAccount = {
            isBifrost: false,
            address: this.activeAddr,
            privateKey
        };
    }

    setAddrList(): any[] {
        if (this.status === StatusMap.LOCK) {
            if (!this.activeAddr) {
                this.addrList = [];
                return this.addrList;
            }

            const item: any = getAddr(this.activeAddr);
            item.address = this.activeAddr;
            item.id = this.id;
            item.idx = this.activeIdx;
            this.addrList = [item];
            return this.addrList;
        }

        const myWallet = wallet.getWallet(this.mnemonic);
        const list = myWallet.deriveAddressList(0, this.addrNum - 1);
        const addrList: any[] = [];

        list.forEach((addrObj, i) => {
            const item = {
                ...addrObj,
                ...getAddr(addrObj.address)
            };
            item.id = this.id;
            item.idx = i;
            addrList.push(item);
        });
        this.addrList = addrList;
        return this.addrList;
    }

    getAddrObj(index, address) {
        if ((!index && index !== 0 && !address) || !this.addrList.length) {
            return null;
        }

        if ((index || index === 0) && !this.addrList[index]) {
            return null;
        }

        if (index || index === 0) {
            return this.addrList[index];
        }

        for (let i = 0; i < this.addrList.length; i++) {
            if (this.addrList[i].address === address) {
                return this.addrList[i];
            }
        }

        return null;
    }
}
