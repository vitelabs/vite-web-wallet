import { Client } from './request';

export const Server = {
    crosschainGate: { // PC
        hostKey: 'CROSSCHAIN',
        url: process.env.gatewayInfosServer,
        watchList: []
    },
    conversionGate: { // PC
        hostKey: 'GATEWAY',
        url: '',
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
    dexAPI: { // BOTH
        hostKey: 'VITEX',
        url: process.env.dexApiServer,
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

        super(`${ url }${ baseUrl }`, afterResponse, headersBase);
        setWatch(serverKey, url => {
            this.setHost(`${ url }${ baseUrl }`);
        });
    }
}

export function setWatch(serverKey, cb) {
    if (!Server[serverKey] || !cb) {
        throw 'No Server Key or no callback';
    }

    Server[serverKey].watchList.push(cb);
    return Server[serverKey].url;
}

new Client('/dns', function (xhr) {
    const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

    if (code !== 0) {
        return Promise.reject({
            code,
            subCode,
            message: msg || error
        });
    }

    return Promise.resolve(data || null);
}).request({ path: '/hostips' })
    .then(data => {
        if (!data) {
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
    })
    .catch(err => {
        console.warn(err);
    });
