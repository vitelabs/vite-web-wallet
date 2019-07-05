import Connector from '/Users/yuanzhang/vitecodes/walletconnect-monorepo/packages/browser';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'store';

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
                isBirforst: true
            });
            getCurrHDAcc().unlock(this);
            store.commit('switchHDAcc', {
                activeAddr: accounts[0],
                isBirforst: true
            });
            store.commit('setCurrHDAccStatus');
            const name = store.state.env.lastPage || 'tradeCenter';
            this.$router.push({ name });
        });
        this.on('disconnect', () => {
            console.log('disconnect');
            if (getCurrHDAcc() && getCurrHDAcc().isBirforst) {
                getCurrHDAcc().lock();
                store.commit('setCurrHDAccStatus');
            }
        });
    }

    async createSession() {
        await super.createSession();
        return this.uri;
    }

    destroy() {
        console.log('distory vb');
    // this.offAllListener()
    }

    async sendVbTx(...args) {
        return this.sendCustomRequest({ method: 'vite_sendTx', params: args });
    }
}
export let vbInstance = null;
export function initVB() {
    vbInstance = new VB({ bridge: BRIDGE });
    vbInstance.createSession().then(() => console.log('ffff', vbInstance.uri));
    return vbInstance;
}
