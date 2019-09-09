import { getClient } from 'utils/request';

const ViteX_API_Path = `${ process.env.dexApiServer }v1`;
const Conversion_API_Path = '/gw';

export const ViteXAPI = getClient(ViteX_API_Path, function (xhr) {
    const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

    if (code !== 0) {
        return Promise.reject({
            code,
            subCode,
            message: msg || error
        });
    }

    return Promise.resolve(data || null);
});

export const ConversionAPI = getClient(Conversion_API_Path);
