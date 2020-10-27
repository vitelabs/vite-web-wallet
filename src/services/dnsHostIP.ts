import { Client } from 'utils/request';

let dnsHostServer = process.env.dnsHostServer || [];
dnsHostServer = Array.isArray(dnsHostServer) ? dnsHostServer : [];

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
        url: 'https://x.vite.net/api/config',
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

function pingHost() {
    let pingResults = 0;
    const maxPingResults = dnsHostServer.length;

    if (maxPingResults < 2) {
        return callReady();
    }

    dnsHostServer.forEach(configServer => {
        const startTime = new Date().getTime();
        new Client(`${ configServer }/dns`, function (xhr) {
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
                // If pingResults >= maxPingResults, server is ok. Do nothing.
                if (pingResults >= maxPingResults) return;

                if (!data) {
                    throw new Error('Config data is null');
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
                // Server is ok, set pingResults to maxPingResults;
                pingResults = maxPingResults;
                callReady();
                console.log(`Set dns host to: ${ configServer }`);
            })
            .catch(err => {
                console.warn(err);

                pingResults++;
                // If server is ok, do nothing.
                if (pingResults > maxPingResults) {
                    return;
                }
                // If all servers are failed, init ready function.
                if (pingResults === maxPingResults) {
                    callReady();
                }
            })
            .finally(() => {
                console.log(`Get result from dns host [${ configServer }], cost time: ${ new Date().getTime() - startTime } ms`);
            });
    });
}


function callReady() {
    Server.isReady = true;
    Server.onReady.forEach((cb: Function) => {
        cb && cb();
    });
}
