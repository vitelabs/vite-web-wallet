const urlLibs = require('url');

const protocols = [ 'http:', 'https:' ];

export default function (url) {
    const urlRes = urlLibs.parse(url);
    if (!urlRes || protocols.indexOf(urlRes.protocol) === -1) {
        return;
    }

    window.open(`${ urlRes.href }`);
}

