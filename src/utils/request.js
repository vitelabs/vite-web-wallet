import qs from 'qs';

const reqTimeout = 30000;

export default function request({ method = 'GET', path, params = {} }) {
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
        }, reqTimeout);
        
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
            if (xhr.status == 200) {
                try {
                    let { code, msg, data, error } = JSON.parse(xhr.responseText);
                    if (code !== 200) {
                        return _rej({
                            code,
                            message: msg || error
                        });
                    }

                    data = data || null;
                    _res(data);
                } catch (e) {
                    rej(e);
                }
            } else {
                _rej( JSON.parse(xhr.responseText) );
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