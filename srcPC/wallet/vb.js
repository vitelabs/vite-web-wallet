import Connector from '@vite/connector';
import { setCurrHDAcc, getCurrHDAcc } from './index';
import store from 'pcStore';
import { Server } from 'services/dnsHostIP';
import { constant } from 'pcUtils/store';

const { VCSessionKey } = constant;

export class VB extends Connector {
    constructor(opts, meta) {
        super(opts, meta);
        // eslint-disable-next-line
        this.on("connect", (err, payload) => {
            const { accounts } = payload.params[0];
            this.setAccState(accounts);
        });
        this.on('disconnect', () => {
            sessionStorage.removeItem(VCSessionKey);
            if (getCurrHDAcc() && getCurrHDAcc().isBifrost) {
                getCurrHDAcc().lock();
                store.commit('setCurrHDAccStatus');
            }
        });
        this.on('session_update', () => {
            const { session } = arguments[0];
            if (session && session.accounts) {
                this.setAccState(session.accounts);
            }
        });
    }

    setAccState(accounts = []) {
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
        this.saveSession();
    }

    saveSession() {
        const sessionData = {
            session: this.session,
            timestamp: new Date().getTime()
        };
        sessionStorage.setItem(VCSessionKey, JSON.stringify(sessionData));
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

            this.sendCustomRequest({ method: 'vite_signAndSendTx', params: args }).then(r => {
                this.saveSession();
                res(r);
            }).catch(e => {
                rej(e);
            });
        });
    }

    async signVbText(...args) {
        return new Promise((res, rej) => {
            this.on('disconnect', () => {
                rej({ code: 11020, message: '链接断开' });
            });

            this.sendCustomRequest({ method: 'vite_signMessage', params: args }).then(r => {
                this.saveSession();
                res(r);
            }).catch(e => {
                rej(e);
            });
        });
    }
}

export let vbInstance = null;

export function getVbInstance() {
    return vbInstance;
}

export function getValidSession() {
    let sessionData = null;
    let session = null;
    try {
        const tm = sessionStorage.getItem(VCSessionKey);
        if (tm) {
            sessionData = JSON.parse(tm);
        }
    } catch (err) {
        console.warn(err);
    }

    if (sessionData && sessionData.timestamp) {
        if (new Date().getTime() - sessionData.timestamp < 1000 * 60 * 10) {
            console.log('Found session on sessionStorage');
            session = sessionData.session;
        } else {
            console.log('Found session on sessionStorage, but this session is timeout');
        }
    }
    return session;
}

export function initVB(meta = null) {
    if (!Server.isReady) {
        console.log('DNS not ready');
        return;
    }

    const session = getValidSession();

    vbInstance = new VB({
        bridge: Server.viteConnect.url,
        session
    }, meta);

    if (!session) {
        vbInstance.createSession().then(() => console.log('connect uri', vbInstance.uri));
    }
    return vbInstance;
}

// vite_f953d55bd0c6f33c211dc4b02587aa662edd9d0d7305c8ef19
