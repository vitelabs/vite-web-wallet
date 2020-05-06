import Connector from '@vite/connector';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'pcStore';
import { Server } from 'services/dnsHostIP';

export class VB extends Connector {
    constructor(opts, meta) {
        super(opts, meta);
        // eslint-disable-next-line
        this.on("connect", (err, payload) => {
            const { accounts } = payload.params[0];
            if (!accounts || !accounts[0]) throw new Error('address is null');
            setCurrHDAcc({
                activeAddr: accounts[0],
                isBifrost: true,
                isSeparateKey: true
            });
            getCurrHDAcc().unlock(this);
            store.commit('switchHDAcc', {
                activeAddr: accounts[0],
                isBifrost: true,
                isSeparateKey: true
            });
            store.commit('setCurrHDAccStatus');
        });
        this.on('disconnect', () => {
            if (getCurrHDAcc() && getCurrHDAcc().isBifrost) {
                getCurrHDAcc().lock();
                store.commit('setCurrHDAccStatus');
            }
        });
    }

    async createSession() {
        await super.createSession();
        return this.uri;
    }

    async sendVbTx(...args) {
        return new Promise((res, rej) => {
            this.on('disconnect', () => {
                rej({ code: 11020, message: '链接断开' });
            });

            this.sendCustomRequest({ method: 'vite_signAndSendTx', params: args }).then(r => res(r)).catch(e => {
                rej(e);
            });
        });
    }

    async signVbText(...args) {
        return new Promise((res, rej) => {
            this.on('disconnect', () => {
                rej({ code: 11020, message: '链接断开' });
            });

            this.sendCustomRequest({ method: 'vite_signMessage', params: args }).then(r => res(r)).catch(e => {
                rej(e);
            });
        });
    }
}

export let vbInstance = null;

export function getVbInstance() {
    return vbInstance;
}

export function initVB(meta = null) {
    if (!Server.isReady) {
        console.log('DNS not ready');
        return;
    }

    vbInstance = new VB({ bridge: Server.viteConnect.url }, meta);
    vbInstance.createSession().then(() => console.log('connect uri', vbInstance.uri));
    return vbInstance;
}

// vite_f953d55bd0c6f33c211dc4b02587aa662edd9d0d7305c8ef19
