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
        url: '//web-wallet-1257137467.cos.ap-hongkong.myqcloud.com',
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

if (location.origin === 'https://x.leanfaces.com') {
    Server.dexAPI.url = 'https://vitex.leanfaces.com';
    Server.dexPush.url = 'wss://vitex.leanfaces.com/websocket';
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

if (process.env.NODE_ENV === 'production') {
    new Client(`${ process.env.dnsHostServer }/dns`, function (xhr) {
        const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

        if (code !== 0) {
            return Promise.reject({
                code,
                subCode,
                message: msg || error
            });
        }

        return Promise.resolve(data || null);
    }).request({ path: '/hostips', timeout: 3000 })
        .then(data => {
            if (!data) {
                callReady();
                return;
            }

            for (const key in Server) {
                const { hostKey, url } = Server[key];

                const hostConfig = data[hostKey];
                if (!hostConfig || !hostConfig.hostNameList || !hostConfig.hostNameList.length) {
                    continue;
                }

                const hostIp = hostConfig.hostNameList[0];
                if (hostIp === url) {
                    continue;
                }

                Server[key].url = hostIp;
                Server[key].watchList.forEach(cb => {
                    cb && cb(hostIp);
                });
            }
            callReady();
        })
        .catch(err => {
            callReady();
            console.warn(err);
        });
} else {
    callReady();
}


function callReady() {
    Server.isReady = true;
    Server.onReady.forEach((cb: Function) => {
        cb && cb();
    });
}
