import { Client } from '@utils/request';

const apiConfigUrl = import.meta.env.VITE_API_CONFIG;

export const Server = {
    isReady: false,
    onReady: [],

    crosschainGate: { // PC
        hostKey: 'CROSSCHAIN',
        url: import.meta.env.VITE_CROSSCHAIN_SERVER,
        watchList: []
    },
    conversionGate: { // PC
        hostKey: 'GATEWAY',
        url: import.meta.env.VITE_GATEWAY,
        watchList: []
    },
    h5Config: { // PC
        hostKey: 'WEBCONFIG',
        url: 'https://static.vite.net/web-wallet-1257137467',
        watchList: []
    },
    ethExplorer: { // PC
        hostKey: 'ETH_EXPLORER',
        url: import.meta.env.VITE_ETH_EXPLORER,
        watchList: []
    },
    ethServer: { // PC
        hostKey: 'ETH_NODE',
        url: import.meta.env.VITE_ETH_SERVER,
        watchList: []
    },

    viteConnect: { // PC
        hostKey: 'VITE_CONNECT',
        url: import.meta.env.VITE_CONNECT,
        watchList: []
    },
    dexPush: { // BOTH
        hostKey: 'DEXPUSHSERVER',
        url: import.meta.env.VITE_PUSH_SERVER,
        watchList: []
    },
    gViteAPI: { // BOTH
        hostKey: 'WALLETWSAPI',
        url: window.VITE_NODE_API || import.meta.env.VITE_SERVER,
        watchList: []
    },

    dexAPI: { // BOTH
        hostKey: 'VITEX',
        url: import.meta.env.VITE_DEX_SERVER,
        watchList: []
    },
    viteExplorer: { // BOTH
        hostKey: 'EXPLORER',
        name: 'viteView',
        url: import.meta.env.VITE_VIEW,
        watchList: []
    }
};

export function getApiConfig() {
    return new Client(`${ apiConfigUrl }/dns`, function (xhr) {
        const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

        if (code !== 0) {
            return Promise.reject({
                code,
                subCode,
                message: msg || error
            });
        }

        return Promise.resolve(data || null);
    })
        .request({ path: '/hostips', timeout: 3000 })
        .then(data => {
            if (!data) {
                throw new Error('Config data is null');
            }
            return data;
        });
}


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
