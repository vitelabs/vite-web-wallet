import qs from 'qs';

const reqTimeout = 30000;

export default function request({ method = 'GET', path, params = {}, timeout = reqTimeout }) {
    method = method.toUpperCase();

    const xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    const qsStr = qs.stringify(params);

    method === 'GET' && (
        path.indexOf('?') < 0 ? 
            (path = `${path}?${qsStr}`) : 
            (path = `${path}${qsStr}`)
    );

    xhr.open(method, path, true);
    xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');

    if (method === 'POST') {
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }

    return new Promise((res, rej) => {        
        xhr.onload = function () {
            try {
                if (xhr.status == 200) {                    
                    if (path.indexOf('kline') !== -1) {
                        res(JSON.parse(xhr.responseText));
                        return;
                    }

                    let { code, msg, data, error } = JSON.parse(xhr.responseText);
                    let rightCode = path.indexOf('api') === 1 ? 0 : 200;
                    if (code !== rightCode) {
                        return rej({
                            code,
                            message: msg || error
                        });
                    }

                    res(data || null);
                } else {
                    rej( JSON.parse(xhr.responseText) );
                }
            } catch (e) {
                rej({
                    status: xhr.status,
                    message: xhr.responseText || e
                });
            }
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