import Connector from '/Users/yuanzhang/vitecodes/walletconnect-monorepo/packages/browser';

export const BRIDGE = 'ws://hurrytospring.com:5001';
export class VB extends Connector {
    constructor(opts) {
        super(opts);
        // eslint-disable-next-line
        this.on('connect', (error, _payload) => {
            if (error) {
                throw error;
            }
            // const { accounts, chainId } = payload.params[0];
        });
        // eslint-disable-next-line
        this.on('disconnect', (error, _payload) => {
            if (error) {
                throw error;
            }
            // Delete walletConnector
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
        console.log('sendvbtxxxxxx', args);
    }
}
export let vbInstance = null;
export function initVB() {
    vbInstance = new VB({ bridge: BRIDGE });
    vbInstance.createSession().then(() => console.log('ffff', vbInstance.uri));
    return vbInstance;
}
