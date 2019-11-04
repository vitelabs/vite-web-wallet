import { DNSClient } from 'utils/dnsHostIP';
import i18n from 'pcI18n';

const langMap = {
    zh: 'zh-cn',
    'zh-Hans': 'zh-cn',
    en: 'en'
};

export const ConversionAPI = new DNSClient({
    serverKey: 'conversionGate',
    baseUrl: '/gw'
});

export const ConfigClient = new DNSClient({
    serverKey: 'h5Config',
    afterResponse: xhr => {
        try {
            const data = JSON.parse(xhr.responseText);
            return Promise.resolve(data || null);
        } catch (e) {
            return Promise.reject(xhr.responseText);
        }
    },
    baseUrl: process.env.NODE_ENV === 'production' ? '' : '/test'
});

export const CrosschainGate = new DNSClient({
    serverKey: 'crosschainGate',
    afterResponse: xhr => {
        const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);
        if (code === 0) {
            return Promise.resolve(data || null);
        }

        return Promise.reject({
            code,
            subCode,
            message: msg || error
        });
    },
    headersBase: { lang: langMap[i18n.locale], version: 'v1.0' }
});
