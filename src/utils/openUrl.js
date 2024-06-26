// const urlLibs = require('url');
import * as urlLibs from "url";

const protocols = [ 'http:', 'https:' ];
// const middlePage = 'https://middlejump.netlify.com/';

export default function (url) {
    const urlRes = urlLibs.parse(url);
    if (!urlRes || protocols.indexOf(urlRes.protocol) === -1) {
        return;
    }

    window.open(urlRes.href);
    // window.open(`${ middlePage }?target=${ encodeURIComponent(urlRes.href) }`);
}
