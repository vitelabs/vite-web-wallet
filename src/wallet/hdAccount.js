import {
    keystore,
    constant,
    hdAddr,
    account,
    addrAccount
} from '@vite/vitejs';
import viteCrypto from 'testwebworker';
import statistics from 'utils/statistics';
import $ViteJS from 'utils/viteClient';
import { constant as u_constant } from 'utils/store';

import {
    getAddr,
    addHdAccount,
    setAcc,
    getAcc,
    setAccInfo,
    setAddr,
    setLastAcc
} from './store';

const { LangList } = constant;
const maxAddrNum = 10;

export const StatusMap = {
    LOCK: 0,
    UNLOCK: 1
};

export class HDAccount {
    constructor({
        id,
        lang,
        keystore,
        name,
        addrNum,
        activeAddr,
        activeIdx
    }) {
        this.status = StatusMap.LOCK;

        this.id = id;
        this.keystore = keystore;
        this.lang = lang || LangList.english;
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

    // saveOnActiveAddr() {
    //     setAddrInfo()
    // }

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
        const entropy = await keystore.decrypt(JSON.stringify(this.keystore),
            pass,
            viteCrypto);
        const after = new Date().getTime();
        statistics.event('mnemonic-decrypt',
            this.keystore.version,
            'time',
            after - before);

        // Set Base Info
        this.status = StatusMap.UNLOCK;
        this.pass = pass;
        this.mnemonic = hdAddr.getMnemonicFromEntropy(entropy, this.lang);
        this.id = hdAddr.getId(this.mnemonic, this.lang);

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
        this.activeAccount && this.activeAccount.clearPrivateKey();
        this.setAddrList();
    }

    activate() {
        // auto receive tx
        if (this.status === StatusMap.LOCK || !this.activeAccount) {
            return;
        }
        this.activeAccount.activate(2000, true, true);
        return this.activeAccount;
    }

    freeze() {
        // kill auto receive
        if (!this.activeAccount) {
            return;
        }
        this.activeAccount.freeze();
    }

    addAddr() {
        if (this.status === StatusMap.LOCK) {
            return null;
        }

        const index = this.addrList.length;
        if (index >= maxAddrNum) {
            return null;
        }

        const addrObj = hdAddr.getAddrFromMnemonic(this.mnemonic, index, this.lang);
        addrObj.address = addrObj.hexAddr;
        addrObj.idx = index;
        addrObj.id = this.id;

        this.addrList.push(addrObj);
        this.addrNum = this.addrList.length;
        this.saveAcc();
        return addrObj;
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

    setActiveAcc(index, address) {
        if (this.status === StatusMap.LOCK) {
            this.activeIdx = index || 0;
            this.activeAddr = address || '';

            if (!this.activeAddr) {
                this.activeAccount = null;
                return;
            }

            this.activeAccount = new account({
                client: $ViteJS,
                address: this.activeAddr
            });
            return;
        }

        const addrObj = this.getAddrObj(index, address);
        if (!addrObj) {
            return;
        }

        this.activeAddr = addrObj.hexAddr;
        this.activeIdx = addrObj.idx;
        const privateKey = addrObj.privKey;

        if (this.activeAccount && this.activeAccount.address === this.activeAddr) {
            !this.activeAccount.privateKey
                && this.activeAccount.setPrivateKey(privateKey);
            return;
        }

        this.activeAccount = new account({
            client: $ViteJS,
            privateKey,
            address: this.activeAddr
        });
    }

    setAddrList() {
        if (this.status === StatusMap.LOCK) {
            if (!this.activeAddr) {
                this.addrList = [];
                return this.addrList;
            }

            const item = getAddr(this.activeAddr);
            item.address = this.activeAddr;
            item.id = this.id;
            item.idx = this.activeIdx;
            this.addrList = [item];
            return this.addrList;
        }

        const list = hdAddr.getAddrsFromMnemonic(this.mnemonic,
            0,
            this.addrNum,
            this.lang);
        const addrList = [];
        list.forEach((addrObj, i) => {
            const item = {
                ...addrObj,
                ...getAddr(addrObj.hexAddr)
            };
            item.address = addrObj.hexAddr;
            item.id = this.id;
            item.idx = i;
            addrList.push(item);
        });
        this.addrList = addrList;
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

export class VBAccount {
    constructor({
        id,
        lang,
        name,
        activeAddr
    }) {
        this.id = id || `VITEBIRFORST_${ activeAddr }`;
        this.lang = lang || LangList.english;
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
    }

    set activeAccount(v) {
        this._activeAccount = v;
    }

    get activeAccount() {
        return this._activeAccount;
    }

    get isBifrost() {
        return this.id.startsWith('VITEBIRFORST_');
    }

    save() {
        addHdAccount({
            id: this.id,
            lang: this.lang,
            keystore: 'birforst'
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

    activate() {
        return this.activeAccount;
    }

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
        return Object.assign({}, getAcc(this.id), { [u_constant.HoldPwdKey]: true });
    }

    lock() {
        this.vb.killSession();
        this.vb.destroy();

        this.proxyActiveAcc.sendPowTx = undefined;
        this.status = StatusMap.LOCK;
        this.vb = null;
    }

    setActiveAcc() {
        const account = new addrAccount({
            client: $ViteJS,
            address: this.activeAddr
        });
        const proxyActiveAcc = Object.create(null);
        proxyActiveAcc.address = this.activeAddr;
        proxyActiveAcc.isBifrost = true;
        this._activeAccount = new Proxy(account, {
            get(target, name) {
                if (proxyActiveAcc[name]) {
                    return proxyActiveAcc[name];
                }
                return target[name];
            }
        });
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
            vbExtends
        }) => {
            if (params[0]) {
                params[0].prevHash = 'hack for birforst';
                params[0].height = 34;
            }
            const block = await this.activeAccount.getBlock[methodName](params[0], 'sync');

            return vb.sendVbTx({
                block,
                extend: vbExtends
            });
        };
        this.status = StatusMap.UNLOCK;
        this.proxyActiveAcc.sendPowTx = sendPowTx;
        setLastAcc({ id: this.id });
    }
}
