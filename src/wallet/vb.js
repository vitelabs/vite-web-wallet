import Connector from '@vite/bifrost';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'store';
import router from 'router';

export const BRIDGE = 'wss://biforst.vitewallet.com';
export class VB extends Connector {
    constructor(opts, meta) {
        super(opts, meta);
        // eslint-disable-next-line
    this.on("connect", (err, payload) => {
            const { accounts } = payload.params[0];
            if (!accounts || !accounts[0]) throw new Error('address is null');
            setCurrHDAcc({
                activeAddr: accounts[0],
                isBifrost: true
            });
            getCurrHDAcc().unlock(this);
            store.commit('switchHDAcc', {
                activeAddr: accounts[0],
                isBifrost: true
            });
            store.commit('setCurrHDAccStatus');
            const name = store.state.env.lastPage || 'tradeCenter';
            router.push({ name });
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
}
export let vbInstance = null;
export function getVbInstance() {
    return vbInstance;
}
export function initVB(meta = null) {
    vbInstance = new VB({ bridge: BRIDGE }, meta);
    vbInstance.createSession().then(() => console.log('connect uri', vbInstance.uri));
    return vbInstance;
}
