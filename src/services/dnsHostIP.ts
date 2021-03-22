import { Client } from 'utils/request';

export const Server = {
    isReady: false,
    onReady: [],

    crosschainGate: { // PC
        hostKey: 'CROSSCHAIN',
        url: process.env.gatewayInfosServer,
        watchList: []
    },
    conversionGate: { // PC
        hostKey: 'GATEWAY',
        url: process.env.conversionGate,
        watchList: []
    },
    h5Config: { // PC
        hostKey: 'WEBCONFIG',
        url: 'https://static.vite.net/web-wallet-1257137467',
        watchList: []
    },
    ethExplorer: { // PC
        hostKey: 'ETH_EXPLORER',
        url: process.env.ethExplorer,
        watchList: []
    },
    ethServer: { // PC
        hostKey: 'ETH_NODE',
        url: process.env.ethServer,
        watchList: []
    },

    viteConnect: { // PC
        hostKey: 'VITE_CONNECT',
        url: process.env.viteConnect,
        watchList: []
    },
    dexPush: { // BOTH
        hostKey: 'DEXPUSHSERVER',
        url: process.env.pushServer,
        watchList: []
    },
    gViteAPI: { // BOTH
        hostKey: 'WALLETWSAPI',
        url: process.env.goViteServer,
        watchList: []
    },

    dexAPI: { // BOTH
        hostKey: 'VITEX',
        url: process.env.dexApiServer,
        watchList: []
    },
    viteExplorer: { // BOTH
        hostKey: 'EXPLORER',
        url: process.env.viteExplorer,
        watchList: []
    }
};


export class DNSClient extends Client {
    constructor({
        serverKey,
        afterResponse,
        headersBase = {},
        baseUrl = ''
    }: {
        serverKey: string,
        afterResponse?: Function,
        headersBase?: Object,
        baseUrl?: string
    }) {
        if (!Server[serverKey]) {
            throw 'No Server Key or no callback';
        }

        const { url } = Server[serverKey];
        super(getUrl(url, baseUrl), afterResponse, headersBase);

        setWatch(serverKey, url => {
            this.setHost(getUrl(url, baseUrl));
        });
    }
}
function getUrl(pre, after) {
    pre.slice(-1) === '/' && (pre = pre.slice(0, -1));
    after.indexOf('/') === 0 && (after = after.slice(1));
    return `${ pre }/${ after }`;
}

export function setWatch(serverKey, cb) {
    if (!Server[serverKey] || !cb) {
        throw 'No Server Key or no callback';
    }

    Server[serverKey].watchList.push(cb);
    return Server[serverKey].url;
}

export function onReady(cb: Function) {
    if (!cb) {
        return;
    }
    const list: Array<Function> = Server.onReady;
    list.push(cb);
}


callReady();

function callReady() {
    Server.isReady = true;
    Server.onReady.forEach((cb: Function) => {
        cb && cb();
    });
}
