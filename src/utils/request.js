import qs from 'qs';

export default  function request({ method = 'GET', url, params = {} }) {
    method = method.toUpperCase();

    const xhr = new XMLHttpRequest();
    const qsStr = qs.stringify(params);

    method === 'GET' && (
        url.indexOf('?') < 0 ? 
            (url = `${url}?${qsStr}`) : 
            (url = `${url}${qsStr}`)
    );

    xhr.open(method, url, true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    if (method === 'POST') {
        xhr.send(qsStr);
    } else {
        xhr.send();
    }

    return new Promise((res, rej) => {
        xhr.onload = function () {
            if (xhr.status == 200) {
                try {
                    res(JSON.parse(xhr.responseText));
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