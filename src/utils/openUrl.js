const urlLibs = require('url');

const protocols = [ 'http:', 'https:' ];
const middlePage = 'https://middlejupm.netlify.com/';
export default function (url) {
    const urlRes = urlLibs.parse(url);
    if (!urlRes || protocols.indexOf(urlRes.protocol) === -1) {
        return;
    }

    window.open(`${ middlePage }?target=${ encodeURIComponent(urlRes.href) }`);
}

