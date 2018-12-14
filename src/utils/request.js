import qs from 'qs';

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

    console.log(xhr.body);

    if (method === 'POST') {
        xhr.send(JSON.stringify(params));
    } else {
        xhr.send();
    }

    return new Promise((res, rej) => {
        xhr.onload = function () {
            if (xhr.status == 200) {
                try {
                    console.log(xhr.responseText);
                    let { code, msg, data, error } = JSON.parse(xhr.responseText);
                    if (code !== 200) {
                        return rej({
                            code,
                            message: msg || error
                        });
                    }

                    data = data || null;
                    res(data);
                } catch (e) {
                    rej(e);
                }
            } else {
                rej();
            }
        };
        xhr.onerror = function (err) {
            console.error(err);
            rej();
        };
        xhr.onabort = function (x) {
            console.warn(x);
            rej();
        };
        xhr.ontimeout = function (time) {
            console.warn(time);
            rej();
        };
    });
}