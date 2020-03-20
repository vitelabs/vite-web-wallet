import TransportWebBLE from '@ledgerhq/hw-transport-web-ble';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import LedgerVite from '@vite/ledgerjs-hw-app-vite';
import Eventemitter from 'eventemitter3';
import { accountBlock } from '@vite/vitejs';
const { utils } = accountBlock;

import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'pcStore';
import { Server } from 'services/dnsHostIP';

export class Ledger extends Eventemitter {
    constructor({ connectType = 'usb' }) {
        super();
        this.connectType = connectType;
        this.transport = null;
        this.connector = null;

        // 0: disconnect 1: connect
        this.status = 0;

        // 选择完地址之后触发
        this.on('connected', ({ address, addressIndex, publicKey }) => {
            if (!address) throw new Error('address is null');
            setCurrHDAcc({
                activeAddr: address,
                isHardware: true,
                publicKey
            });
            getCurrHDAcc().unlock(this);
            store.commit('switchHDAcc', {
                activeAddr: address,
                isHardware: true,
                addressIndex,
                publicKey
            });
            store.commit('setCurrHDAccStatus');
        });
    }

    async connect() {
        if (this.connectType === 'usb') {
            this.transport = await TransportWebUSB.create();
        } else {
            this.transport = await TransportWebBLE.create();
        }
        this.status = 1;
        this.transport.on('disconnect', () => {
            console.log('Ledger hardware disconnect!');

            if (getCurrHDAcc() && getCurrHDAcc().isHardware) {
                getCurrHDAcc().lock();
                store.commit('setCurrHDAccStatus');
            }
            this.status = 0;
        });
        this.connector = new LedgerVite(this.transport);
        return this.connector;
    }


    async getAddressList(startIndex = 0, length = 5) {
        const list = [];
        for (let i = startIndex; i < startIndex + length; i++) {
            const address = await this.connector.getAddress(i, false)
                // ledgerMock
                .catch(() => {
                    return {
                        address: 'vite_574963ad867047fef64a941e53f1fd01ce7ba241b80c20f537',
                        publicKey: `publicKey_${ i }`
                    };
                });
            list.push({
                ...address,
                index: i
            });
        }
        return list;
    }

    async signHwTx(addressIndex, _accountBlock) {
        const { height, _toAddress, amount, tokenId, data, fee, previousHash, nonce, sendBlockHash, blockType } = _accountBlock;

        if (utils.isResponseBlock(blockType)) {
            return this.connector.signResponseAccountBlock(addressIndex, height, sendBlockHash, previousHash, nonce);
        }
        return this.connector.signRequestAccountBlock(addressIndex,
            height,
            _toAddress,
            amount,
            tokenId,
            data,
            fee,
            previousHash,
            nonce);
    }

    destroy() {
        ledgerInstance = null;
    }
}

export let ledgerInstance = null;

export function getLedgerInstance() {
    return ledgerInstance;
}

export async function initLedger({ connectType }) {
    if (connectType === 'usb' && !TransportWebUSB.isSupported()) {
        console.log('This browsers don\'t support WebUSB');
        return Promise.reject('This browsers don\'t support WebUSB');
    }

    ledgerInstance = new Ledger({ connectType });
    await ledgerInstance.connect();

    // ledgerMock
    const appConfig = await ledgerInstance.connector.getAppConfig().catch(err => err);
    return appConfig;
}
