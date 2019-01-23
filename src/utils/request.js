import qs from 'qs';

const reqTimeout = 30000;

export default function request({ method = 'GET', path, params = {}, timeout = reqTimeout }) {
    method = method.toUpperCase();

    const xhr = new XMLHttpRequest();
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
        let _t = setTimeout(() => {
            _t = null;
            xhr.abort && xhr.abort();
            rej('timeout');
        }, timeout);
        
        let _rej = (err) => {
            if (!_t) {
                return;
            }
            _t && clearTimeout(_t);
            _t = null;
            return rej(err);
        };

        let _res = (data) => {
            if (!_t) {
                return;
            }
            _t && clearTimeout(_t);
            _t = null;
            return res(data);
        };

        xhr.onload = function () {
            try {
                if (xhr.status == 200) {
                    let { code, msg, data, error } = JSON.parse(xhr.responseText);
                    let rightCode = path.indexOf('api') === 1 ? 0 : 200;
                    if (code !== rightCode) {
                        return _rej({
                            code,
                            message: msg || error
                        });
                    }

                    data = data || null;
                    _res(data);
                } else {
                    _rej( JSON.parse(xhr.responseText) );
                }
            } catch (e) {
                _rej({
                    status: xhr.status,
                    message: xhr.responseText || e
                });
            }
        };
        xhr.onerror = function (err) {
            console.error(err);
            _rej(err);
        };
        xhr.onabort = function (x) {
            console.warn(x);
            _rej(x);
        };
        xhr.ontimeout = function (time) {
            console.warn(time);
            _rej('timeout');
        };
    });
}