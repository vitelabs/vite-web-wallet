import provider from '@vite/vitejs-ws';
import { client } from '@vite/vitejs';
import { DNSClient, setWatch } from './dnsHostIP';

export const ViteXAPI = new DNSClient({
    serverKey: 'dexAPI',
    afterResponse: xhr => {
        const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

        if (code !== 0) {
            return Promise.reject({
                code,
                subCode,
                message: msg || error
            });
        }

        return Promise.resolve(data || null);
    },
    baseUrl: `${ process.env.NODE_ENV === 'production' ? '' : '/test' }/api/v1`
});

const url = setWatch('gViteAPI', url => {
    WS_RPC.disconnect();
    viteClient.setProvider(new provider(url), () => {
        console.log('reconnect cussess');
    }, false);
});

const WS_RPC = new provider(url);
export const viteClient = new client(WS_RPC, () => {
    console.log('Connect success');
});
