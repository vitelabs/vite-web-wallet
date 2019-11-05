import qs from 'qs';

const reqTimeout = 30000;

const afterResponseDefault = async function (xhr) {
    const { code, msg, data, error } = JSON.parse(xhr.responseText);

    if (code !== 200) {
        return Promise.reject({
            code,
            message: msg || error
        });
    }

    return Promise.resolve(data || null);
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
    headers = Object.assign({ 'content-type': 'application/json; charset=utf-8' }, headers);
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
            if (+xhr.status !== 200) {
                rej({
                    status: xhr.status,
                    message: xhr.responseText || ''
                });
                return;
            }

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

export class Client {
    constructor(host = '', afterResponse, headersBase = {}) {
        this.host = host;
        this.afterResponse = afterResponse;
        this.headersBase = headersBase;
    }

    setHost(host) {
        this.host = host;
    }

    request({ method = 'GET', path, params = {}, timeout = reqTimeout, host = this.host, headers = {} }) {
        host.slice(-1) === '/' && (host = host.slice(0, -1));
        path.indexOf('/') === 0 && (path = path.slice(1));

        path = `${ host }/${ path }`;
        headers = { ...this.headersBase, ...headers };

        if ((path.indexOf('.') !== -1 || path.indexOf(':') !== -1) && path.indexOf('http') !== 0) {
            path = `${ location.protocol }//${ path }`;
        }

        return request({ method, path, params, timeout, afterResponse: this.afterResponse, headers });
    }
}
