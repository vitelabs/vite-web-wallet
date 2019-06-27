import Connector from '/Users/yuanzhang/vite/walletconnect-monorepo/packages/browser';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import router from 'router';

export const BRIDGE = 'ws://hurrytospring.com:5001';
export class VB extends Connector {
    constructor(opts) {
        super(opts);
        setCurrHDAcc({ activeAddr: 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a' }, true);
        getCurrHDAcc().unlock();
// eslint-disable-next-line 
        this.on('connect', (error, _payload) => {
            if (error) {
                throw error;
            }
            console.log('connectedddd');
            this.address = 'vite_ab24ef68b84e642c0ddca06beec81c9acb1977bbd7da27a87a';
            setCurrHDAcc({ activeAddr: this.address }, true);
            getCurrHDAcc().unlock();
            router.push({
                name: 'start',
                params: { id: getCurrHDAcc().id }
            });
            // const { accounts, chainId } = payload.params[0];
        });
// eslint-disable-next-line 
        this.on('disconnect', (error, _payload) => {
            if (error) {
                throw error;
            }
            if (getCurrHDAcc() && getCurrHDAcc().isBirforst) {
                getCurrHDAcc().lock();
            }
            // Delete walletConnector
        });
    }

    async createSession() {
        await super.createSession();
        console.log('session', this.uri);
        return this.uri;
    }

    destory() {
        // this.offAllListener()
    }
}
export let vbInstance = null;
export async function initVB() {
    vbInstance = new VB({ bridge: BRIDGE });
    return await vbInstance.createSession();
}
