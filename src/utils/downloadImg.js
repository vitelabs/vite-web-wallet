import { utils } from '@vite/vitejs';

const { _Buffer } = utils;

export function fromBase64(str) {
    if (!str) {
        return;
    }
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        const arr = str.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = _Buffer.alloc(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        window.navigator.msSaveBlob(new Blob([u8arr], { type: mime }),
            'download.png');
    } else {
        location.href = str.replace('image/png', 'image/octet-stream');
    }
}
