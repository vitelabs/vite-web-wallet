import Connector from '/Users/yuanzhang/vitecodes/walletconnect-monorepo';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'store';
import router from 'router';

export const BRIDGE = 'ws://hurrytospring.com:5001';
export class VB extends Connector {
    constructor(opts) {
        super(opts);
        // eslint-disable-next-line
    this.on("connect", (err, payload) => {
            const { accounts } = payload.params[0];
            if (!accounts || !accounts[0]) throw new Error('address is null');
            console.log(`approved :${ accounts[0] }`);
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
            console.log('disconnect');
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
        return this.sendCustomRequest({ method: 'vite_sendTx', params: args });
    }
}
export let vbInstance = null;
export function getVbInstance() {
    return vbInstance;
}
export function initVB() {
    vbInstance && vbInstance.destroy();
    vbInstance = new VB({ bridge: BRIDGE });
    vbInstance.createSession().then(() => console.log('connect uri', vbInstance.uri));
    return vbInstance;
}
