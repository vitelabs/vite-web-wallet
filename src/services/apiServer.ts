import { DNSClient } from 'utils/dnsHostIP';

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
