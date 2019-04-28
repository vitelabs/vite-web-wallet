import qs from 'qs';

const reqTimeout = 30000;
const afterResponseDefault = async function (xhr, path) {
    if (+xhr.status === 200) {
        if (path.indexOf('kline') !== -1) {
            return Promise.resolve(JSON.parse(xhr.responseText));
        }
        const { code, msg, data, error } = JSON.parse(xhr.responseText);
        const rightCode = path.indexOf('api') === -1 ? 200 : 0;
        if (code !== rightCode) {
            return Promise.reject({
                code,
                message: msg || error
            });
        }
        return Promise.resolve(data || null);
    }
    return Promise.reject(JSON.parse(xhr.responseText));
};

export default function request({
    method = 'GET',
    path,
    params = {},
    timeout = reqTimeout,
    afterResponse = afterResponseDefault,
    headers = {}
}) {
    method = method.toUpperCase();

    const xhr = new XMLHttpRequest();
    const qsStr = qs.stringify(params);

    method === 'GET'
    && (path.indexOf('?') < 0
        ? (path = `${ path }?${ qsStr }`)
        : (path = `${ path }${ qsStr }`));
    xhr.open(method, path, true);
    xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
    Object.keys(headers).forEach(k => {
        xhr.setRequestHeader(k, headers[k]);
    });
    xhr.timeout = timeout;

    if (method === 'POST') {
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }

    return new Promise((res, rej) => {
        xhr.onload = function () {
            afterResponse(xhr, path).then(d => res(d), d => rej(d)).catch(e => {
                rej({
                    status: xhr.status,
                    message: xhr.responseText || e
                });
            });
        };
        xhr.onerror = function (err) {
            rej(err);
        };
        xhr.onabort = function (x) {
            rej(x);
        };
        xhr.ontimeout = function () {
            rej('timeout');
        };
    });
}

export const getClient = function (baseUrl = '', afterResponse, headersBase = {}) {
    return function ({ method = 'GET', path, params = {}, timeout = reqTimeout, host, headers = {} }) {
        host = host || baseUrl;
        host.slice(-1) === '/' && (host = host.slice(0, -1));
        path.indexOf('/') === 0 && (path = path.splice(1));
        path = `${ host }/${ path }`;
        headers = { ...headersBase, ...headers };
        if ((path.indexOf('.') !== -1 || path.indexOf(':') !== -1) && path.indexOf('http') !== 0) {
            path = `${ location.protocol }//${ path }`;
        }
        // todo 暂时解决自定义网关跨域问题
        return request({ method, path, params, timeout, afterResponse, headers });
    };
};
